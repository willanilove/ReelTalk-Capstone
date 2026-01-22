import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import { ActionIcon, Anchor, Group } from "@mantine/core";

// Footer links
const links = [
  { link: "#", label: "Contact Us" },
  { link: "#", label: "Privacy Policy" },
  { link: "/about", label: "About ReelTalk" },
  { link: "#", label: "Submit Feedback" },
];

function Footer() {
  // Render each footer link as an anchor tag
  // Only prevent default if the link is "#"
  const items = [];

  for (let i = 0; i < links.length; i++) {
    const currentLink = links[i];

    items.push(
      <Anchor
        key={currentLink.label}
        href={currentLink.link}
        c="#354760"
        size="sm"
        lh={1}
        onClick={(event) => {
          if (currentLink.link === "#") {
            event.preventDefault();
          }
        }}
      >
        {currentLink.label}
      </Anchor>
    );
  }

  return (
    // Had to add paddingTop to reduce empty space above footer
    <div
      className="footer"
      style={{
        paddingTop: "8px",
        paddingBottom: "16px",
      }}
    >
      {/* Added flex layout to align links & icons side-by-side */}
      <div
        className="inner"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Footer nav links */}
        <Group className="links">{items}</Group>

        {/* Dummy social media icons */}
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>

          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>

          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}

export default Footer;
