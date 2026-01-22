from flask import Flask, request
from flask_cors import CORS
from sqlalchemy.orm import joinedload
from models import Session, Base, engine, User, Movie, Review
import requests

# When the app starts, check if the tables are there
# Don't delete anything, just add any missing ones
# Creates all tables from the classes in models.py
Base.metadata.create_all(engine)

app = Flask(__name__)
CORS(app)

# ------- BASIC ROUTES -------
@app.route("/")
def main_route():
    return "Welcome to the Movie Review API!"

@app.route("/status")
def status_route():
    return {"message": "Server is up"}

# ------- USER ROUTES -------
# Create a new user
# Needs JSON with username, email & password
@app.route("/users", methods=["POST"])
def create_user_route():
    # Get JSON data from the request
    data = request.get_json()

    # Pull out each field one at a time
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Make sure all required fields are filled in:
    if not username:
        return {"error": "username is required"}, 400
    if not email:
        return {"error": "email is required"}, 400
    if not password:
        return {"error": "password is required"}, 400

    # Open a session to talk to the db
    session = Session()

    # Check for duplicate username
    existing_username = session.query(User).filter_by(username=username).first()
    if existing_username:
        return {"error": "username already exists"}, 409

    # Check for duplicate email
    existing_email = session.query(User).filter_by(email=email).first()
    if existing_email:
        return {"error": "email already exists"}, 409

    # Create a new User object with the provided data
    new_user = User(
        username=username,
        email=email,
        password=password
    )

    # Add the user to the session
    session.add(new_user)

    # Save the new user to the db
    session.commit()

    # Send back the new user as JSON
    return new_user.to_dict()

# Get all users
@app.route("/users", methods=["GET"])
def list_users_route():
    session = Session()
    users = session.query(User).all()
    users_list = [u.to_dict() for u in users]
    return users_list

# Get 1 user by id
@app.route("/users/<int:userId>", methods=["GET"])
def get_user_by_id(userId):
    session = Session()
    user = session.query(User).filter_by(id=userId).first()
    if not user:
        return {"error": "User not found"}, 404
    return user.to_dict()

# Update a user by id
@app.route("/users/<int:userId>", methods=["PUT"])
def update_user_by_id(userId):
    data = request.get_json()
    session = Session()
    user = session.query(User).filter_by(id=userId).first()
    if not user:
        return {"error": "User not found"}, 404

    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    if "password" in data:
        user.password = data["password"]

    session.commit()
    return user.to_dict()

# User login
@app.route("/login", methods=["POST"])
def login_route():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return {"error": "Email and password are required"}, 400

    session = Session()
    user = session.query(User).filter_by(email=email, password=password).first()
    if not user:
        return {"error": "Invalid email or password"}, 401

    return {"message": f"Welcome back, {user.username}!", "user": user.to_dict()}


# ------- MOVIE ROUTES -------
@app.route("/movies", methods=["POST"])
def create_movie_route():
    data = request.get_json()
    title = data.get("title")
    poster_url = data.get("poster_url")
    description = data.get("description")

    if not title:
        return {"error": "title is required"}, 400
    if not poster_url:
        return {"error": "poster_url is required"}, 400
    if not description:
        return {"error": "description is required"}, 400

    session = Session()
    new_movie = Movie(title=title, poster_url=poster_url, description=description)
    session.add(new_movie)
    session.commit()
    return new_movie.to_dict()

@app.route("/movies", methods=["GET"])
def list_movies_route():
    session = Session()
    movies = session.query(Movie).all()
    movies_list = [m.to_dict() for m in movies]
    return movies_list

@app.route("/movies/<int:movieId>", methods=["DELETE"])
def delete_movie_route(movieId):
    session = Session()
    movie = session.query(Movie).filter_by(id=movieId).first()
    if not movie:
        return {"error": "Movie not found"}
    session.delete(movie)
    session.commit()
    return movie.to_dict()

@app.route("/api/movies/<int:movie_id>", methods=["GET"])
def get_movie_details(movie_id):
    session = Session()

    # Fetch movie details from TMDb
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=cc3900e52f180a5eabb5a0f32bbc48e4&language=en-US"
    tmdb_response = requests.get(tmdb_url)
    if tmdb_response.status_code != 200:
        return {"error": "Movie not found on TMDb"}, 404
    tmdb_data = tmdb_response.json()

    movie_data = {
        "id": movie_id,
        "title": tmdb_data.get("title"),
        "poster_url": f"https://image.tmdb.org/t/p/w500{tmdb_data.get('poster_path')}",
        "description": tmdb_data.get("overview"),
        "year": tmdb_data.get("release_date", "")[:4]
    }

    # Get all reviews for this movie from db
    reviews = session.query(Review).filter_by(movie_id=movie_id).options(joinedload(Review.user)).all()
    reviews_list = [r.to_dict() for r in reviews]

    return {
        "movie": movie_data,
        "reviews": reviews_list
    }


# ------- REVIEW ROUTES -------
@app.route("/users/<int:user_id>/reviews", methods=["GET"])
def get_user_reviews(user_id):
    session = Session()
    reviews = session.query(Review).filter_by(user_id=user_id).all()
    reviews_list = []

    for r in reviews:
        tmdb_url = f"https://api.themoviedb.org/3/movie/{r.movie_id}?api_key=cc3900e52f180a5eabb5a0f32bbc48e4&language=en-US"
        tmdb_response = requests.get(tmdb_url)
        if tmdb_response.status_code == 200:
            tmdb_data = tmdb_response.json()
            movie_title = tmdb_data.get("title", "Unknown")
        else:
            movie_title = "Unknown"

        reviews_list.append({
            "id": r.id,
            "movie_id": r.movie_id,
            "movie_title": movie_title,
            "comment": r.comment,
            "rating": r.rating
        })
    return reviews_list

# Create a new review
@app.route("/reviews", methods=["POST"])
def create_review_route():
    data = request.get_json()
    user_id = data.get("user_id")
    movie_id = data.get("movie_id")
    comment = data.get("comment")
    rating = data.get("rating")

    # Allow 0 rating, check comment properly
    if not user_id:
        return {"error": "user_id is required"}, 400
    if not movie_id:
        return {"error": "movie_id is required"}, 400
    if not comment or comment.strip() == "":
        return {"error": "comment is required"}, 400
    if rating is None:
        return {"error": "rating is required"}, 400

    session = Session()
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return {"error": "User not found"}, 404

    new_review = Review(
        user_id=user_id,
        movie_id=movie_id,
        comment=comment,
        rating=rating,
        user=user
    )
    session.add(new_review)
    session.commit()
    session.refresh(new_review)

    return new_review.to_dict()

# Update a review by id
@app.route("/reviews/<int:review_id>", methods=["PUT"])
def update_review_route(review_id):
    data = request.get_json()
    session = Session()
    review = session.query(Review).filter_by(id=review_id).first()
    if not review:
        return {"error": "Review not found"}, 404

    if "comment" in data:
        review.comment = data["comment"]
    if "rating" in data:
        review.rating = data["rating"]

    session.commit()
    session.refresh(review)
    _ = review.user

    return review.to_dict()

# Delete a review by id
@app.route("/reviews/<int:review_id>", methods=["DELETE"])
def delete_review_route(review_id):
    session = Session()
    review = session.query(Review).filter_by(id=review_id).first()
    if not review:
        return {"error": "Review not found"}, 404
    session.delete(review)
    session.commit()
    return review.to_dict()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
