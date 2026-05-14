package auth

import (
	"fmt"
	"ktdev/jwt-api/orm"
	"ktdev/jwt-api/response"

	// token.go
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var hmacSampleSecret []byte = []byte(os.Getenv("JWT_SECRET_KEY"))

type RegisterBody struct {
	Username string `json:"username"   binding:"required"`
	Email    string `json:"email"      binding:"required"`
	Password string `json:"password" binding:"required"`
	Fullname string `json:"fullname" binding:"required"`
}

type LoginBody struct {
	Username string `json:"username"   binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var json LoginBody
	// read token

	if err := c.ShouldBindJSON(&json); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	// check user exits
	var userExits orm.User
	orm.DB.Where("username = ?", json.Username).First(&userExits)
	if userExits.ID == 0 {
		response.BadRequest(c, "user not found")
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(userExits.Password), []byte(json.Password))
	if err == nil {
		hmacSampleSecret := []byte(os.Getenv("JWT_SECRET_KEY"))
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"userID": userExits.ID,
			"exp":    jwt.NewNumericDate(time.Now().Add(time.Hour * 1)), // Expires in 1 hour
		})
		// Sign and get the complete encoded token as a string using the secret
		tokenString, err := token.SignedString(hmacSampleSecret)
		fmt.Println(tokenString, err)

		response.OK(c, "login success", response.LoginData{
			Token:         tokenString,
			SessionExpire: time.Now().Add(time.Hour * 1).Format(time.RFC3339),
		})
		return
	} else {
		response.JSON(c, http.StatusOK, "error", "invalid username or password", nil)
	}
}

// $10$Bxsov2qgd322XccwaLCLYu6/HgndqlS867KYrNkpRh7X9XbJ6eQLi ไม่ปลอดภัยยยยยยยย!!!! Secure

// read profile /
// struct response protocol ใช้กับเส้นอื่นได้ /
// dynamic data = Global /
// Pointer

func Register(c *gin.Context) {
	// validate
	var json RegisterBody
	if err := c.ShouldBindJSON(&json); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	// check user exits
	var userExits orm.User
	orm.DB.Where("username = ?", json.Username).First(&userExits)
	if userExits.ID > 0 {
		response.BadRequest(c, "user already exists")
		return
	}

	// check email exits
	var emailExits orm.User
	orm.DB.Where("email = ?", json.Email).First(&emailExits)
	if emailExits.ID > 0 {
		response.BadRequest(c, "email already exists")
		return
	}

	//create user
	encryptPassword, _ := bcrypt.GenerateFromPassword([]byte(json.Password), 10)
	user := orm.User{Username: json.Username, Email: json.Email, Password: string(encryptPassword), Fullname: json.Fullname}

	orm.DB.Create(&user) // pass pointer of data to Create
	if user.ID > 0 {
		response.OK(c, "register success", response.RegisterData{
			UserID:    user.ID,
			CreatedAt: user.CreatedAt.Format(time.RFC3339),
		})
	} else {
		response.InternalServerError(c, "cannot create user")
	}
}
