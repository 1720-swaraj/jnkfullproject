import "./Header.css";

export default function Header() {
  return (
    <div className="header">

      <div className="left">
        <span>Privacy</span>
        <span>Terms</span>
      </div>

      <div className="center">
        <span>Total Visits:</span>
      </div>

      <div className="right">
        <select>
          <option>Select Language</option>
        </select>

        <img src="fb.png" alt="" />
        <img src="twitter.png" alt="" />

        <img src="play.png" alt="" className="playBtn" />

        <button className="registerBtn">Free Registration</button>
      </div>

    </div>
  );
}