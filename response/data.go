package response

type LoginData struct {
	Token         string `json:"token"`
	SessionExpire string `json:"sessionExpires"`
}

type RegisterData struct {
	UserID    uint   `json:"userID"`
	CreatedAt string `json:"createdAt"`
}

type MyProfileData struct {
	UserID   uint   `json:"userID"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Fullname string `json:"fullname"`
}
