package main

import (
	"log"

	AuthController "ktdev/jwt-api/controller/auth"
	UserController "ktdev/jwt-api/controller/user"
	"ktdev/jwt-api/middleware"
	orm "ktdev/jwt-api/orm"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	orm.InitDB()

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// เส้น Public ไม่ต้องใช้ JWTAuthen
	r.POST("/register", AuthController.Register)
	r.POST("/login", AuthController.Login)

	// เส้น Private ต้องใช้ JWTAuthen
	authorized := r.Group("/users", middleware.JWTAuth()) // อ่าน users
	authorized.GET("/readall", UserController.ReadAll)    // อ่าน user ทั้งหมด

	// อ่าน user ตัวเอง
	authorized.GET("/profile", UserController.ReadMyProfile)
	// Update user ตัวเอง
	authorized.PUT("/updateprofile", UserController.UpdateProfile)
	// Delete account ตัวเอง
	authorized.DELETE("/delete", UserController.DeleteUser)
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server: ", err)
	}

}
