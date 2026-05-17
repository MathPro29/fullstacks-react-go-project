package orm

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID       uint `gorm:"primaryKey"`
	Username string
	Email    string
	Password string
	Fullname string
	Role     string
}
