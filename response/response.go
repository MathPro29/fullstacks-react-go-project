package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Body struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func JSON(c *gin.Context, httpStatus int, status string, message string, data any) {
	c.JSON(httpStatus, Body{
		Status:  status,
		Message: message,
		Data:    data,
	})
}

func OK(c *gin.Context, message string, data any) {
	JSON(c, http.StatusOK, "ok", message, data)
}

func BadRequest(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, Body{
		Status: "error",
		Error:  message,
	})
}

func InternalServerError(c *gin.Context, message string) {
	c.JSON(http.StatusInternalServerError, Body{
		Status: "error",
		Error:  message,
	})
}
