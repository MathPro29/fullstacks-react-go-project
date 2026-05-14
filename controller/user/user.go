package user

import (
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
