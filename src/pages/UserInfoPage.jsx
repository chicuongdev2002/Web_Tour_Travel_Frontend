import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import '../style/StylePage.css'
import UserInfo from "./UserInfo";
function UserInfoPage() {
  return (
    <div>
        <div className="position">
      <div className="nav-header">
        <NavHeader textColor="black" />
      </div>
      <div className="content">
        <UserInfo />
      </div>
    </div>
    </div>
  );
}

export default UserInfoPage;
