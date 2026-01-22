from sqlalchemy import create_engine, ForeignKey, DateTime, func
from sqlalchemy.orm import declarative_base, mapped_column, Mapped, sessionmaker, relationship
from datetime import datetime

# Create a SQLite database named database.db
engine = create_engine("sqlite:///database.db", echo=True)

# Starting point for all models
Base = declarative_base()

# Session lets us talk to the db
Session = sessionmaker(bind=engine)

# ------- USER MODEL -------
class User(Base):
    __tablename__ = "users"

    # id is the main column for users
    # It’s the unique number for each user
    id: Mapped[int] = mapped_column(primary_key=True)

    # Username & email must be filled in
    # They have to be unique so no duplicates
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)

    # Password is required
    # Don’t set it as unique b/c 2 users could choose the same password
    password: Mapped[str] = mapped_column(nullable=False)

    # Helper method: turns a User into a dict
    # handy when sending data back as JSON
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password,
        }

# ------- MOVIE MODEL -------
class Movie(Base):
    __tablename__ = "movies"

    # id is the unique identifier for each movie
    id: Mapped[int] = mapped_column(primary_key=True)

    # Title is required
    # title: Mapped[str] = mapped_column(nullable=False, unique=True)
    title: Mapped[str] = mapped_column(nullable=False)

    # Poster_url stores the image link for the movie poster
    poster_url: Mapped[str] = mapped_column(nullable=False)

    # Short summary of the movie
    description: Mapped[str] = mapped_column(nullable=False)

    # Helper method: turns a Movie object into a dict
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "poster_url": self.poster_url,
            "description": self.description,
        }

# ------- REVIEW MODEL -------
class Review(Base):
    __tablename__ = "reviews"

    # id is the unique identifier for each review
    id: Mapped[int] = mapped_column(primary_key=True)

    # user_id links the review to a user
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # movie_id links the review to a movie
    movie_id: Mapped[int] = mapped_column(nullable=False)

    # comment is the text of the review
    comment: Mapped[str] = mapped_column(nullable=False)

    # rating is the star rating (1–5)
    rating: Mapped[int] = mapped_column(nullable=False)

    # created_at = time when review is made
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationship: each review belongs to 1 user
    user = relationship("User")

    # Helper method: turns a Review object into a dict
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else "Unknown",
            "movie_id": self.movie_id,
            "comment": self.comment,
            "rating": self.rating,
            "created_at": self.created_at,
        }

# If this file is run directly, create the database and tables
if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Database and tables created.")
