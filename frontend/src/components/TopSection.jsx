import "./TopSection.css";

export default function TopSection() {
  return (
    <div className="topSection">

      {/* LEFT: LOGO + TITLE */}
      <div className="topLeft">
        <img
          src="https://th.bing.com/th/id/OIP.wJTQOnZcyOtZWDQpzzNl6gHaEo"
          alt="logo"
          className="logo"
        />

        <div className="brandText">
          <h2>My Organization</h2>
          <p>Management System</p>
        </div>
      </div>

      {/* RIGHT: BANNER */}
      <div className="topRight">
        <img
          src="https://th.bing.com/th/id/OIP.8s4JGVOvnhlxCWpv33vo8QHaFm"
          alt="banner"
          className="banner"
        />
      </div>

    </div>
  );
}