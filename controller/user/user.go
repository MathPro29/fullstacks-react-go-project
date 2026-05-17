package user

import (
	"ktdev/jwt-api/middleware"
	"ktdev/jwt-api/orm"
	"ktdev/jwt-api/response"

	"github.com/gin-gonic/gin"
)

func ReadAll(c *gin.Context) {

	var user []orm.User
	orm.DB.Find(&user)

	// response only id fullname email and username
	var userprofile []gin.H
	for _, u := range user {
		userprofile = append(userprofile, gin.H{
			"id":       u.ID,
			"fullname": u.Fullname,
			"email":    u.Email,
			"username": u.Username,
			"role":     u.Role,
		})
	}

	response.OK(c, "UserReadSuccess", gin.H{
		"users": userprofile,
	})
}

func ReadMyProfile(c *gin.Context) {

	id := c.MustGet("id").(int)
	var user orm.User
	orm.DB.Where("id = ?", id).First(&user)
	if user.ID == 0 {
		response.BadRequest(c, "user does not exist")
		return
	} else {
		response.OK(c, "UserReadSuccess", gin.H{"id": user.ID, "fullname": user.Fullname, "email": user.Email, "username": user.Username})
	}
}

func UpdateProfile(c *gin.Context) {
	type UpdateProfileBody struct {
		Fullname string `json:"fullname" binding:"omitempty"`
		Email    string `json:"email" binding:"omitempty"`
	}
	var json UpdateProfileBody
	if err := c.ShouldBindJSON(&json); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	id := c.MustGet("id").(int)
	var user orm.User
	orm.DB.Where("id = ?", id).First(&user)
	if user.ID == 0 {
		response.BadRequest(c, "user does not exist")
		return
	} else {
		if json.Fullname == "" && json.Email == "" {
			response.BadRequest(c, "no changes detected")
			return
		}

		if json.Email != "" && !middleware.ValidateEmail(json.Email) {
			response.BadRequest(c, "invalid email")
			return
		}

		if json.Fullname != "" && !middleware.ValidateFullname(json.Fullname) {
			response.BadRequest(c, "invalid fullname")
			return
		}

		if json.Fullname == user.Fullname && json.Email != user.Email {
			var emailCheck orm.User
			orm.DB.Where("email = ?", json.Email).First(&emailCheck)
			if emailCheck.ID > 0 {
				response.BadRequest(c, "email already exists")
				return
			}
		}

		if json.Email == "" {
			response.BadRequest(c, "email cannot be empty")
			return
		}

		if json.Fullname != "" {
			user.Fullname = json.Fullname
		}

		if json.Email != "" {
			user.Email = json.Email
		}

		orm.DB.Save(&user)
		response.OK(c, "UserUpdateSuccess", response.UpdateProfileData{
			UserID:   user.ID,
			Fullname: user.Fullname,
			Email:    user.Email,
			Username: user.Username,
		})
	}
}

func DeleteUser(c *gin.Context) {
	id := c.MustGet("id").(int)
	var user orm.User
	orm.DB.Where("id = ?", id).First(&user)
	if user.ID == 0 {
		response.BadRequest(c, "user does not exist")
		return
	} else {
		orm.DB.Delete(&user)
		response.OK(c, "UserDeleteSuccess", nil)
	}
}
