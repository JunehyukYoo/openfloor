const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#282c34",
        color: "#ffffff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <p>Created with ❤️ by @notjune. All rights reserved.</p>
        <p>
          <a href="https://github.com/JunehyukYoo/openfloor">Github</a> {"| "}
          <a href="https://junehyukyoo.com/">Portfolio</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
