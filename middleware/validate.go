package middleware

import "regexp"

func ValidateEmail(email string) bool {
	matched, err := regexp.MatchString(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, email)
	return err == nil && matched
}

func ValidateFullname(fullname string) bool {
	matched, err := regexp.MatchString(`^[A-Za-z]+(?:[ ][A-Za-z]+)*$`, fullname)
	return err == nil && matched
}
