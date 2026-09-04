namespace StudentElectionSystem.Application.Common.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T Data { get; set; } = default!;

    public ApiResponse()
    {
    }

    public ApiResponse(bool success, string message, T data)
    {
        Success = success;
        Message = message;
        Data = data;
    }

    public static ApiResponse<T> SuccessResponse(T data, string message = "Success")
    {
        return new ApiResponse<T>(true, message, data);
    }

    public static ApiResponse<object> SuccessResponse(string message = "Success")
    {
        return new ApiResponse<object>(true, message, new object());
    }

    public static ApiResponse<object> FailureResponse(string message, object? data = null)
    {
        return new ApiResponse<object>(false, message, data ?? new object());
    }
}

public static class ApiResponse
{
    public static ApiResponse<T> Success<T>(T data, string message = "Success") => new(true, message, data);
    public static ApiResponse<object> Success(string message = "Success") => new(true, message, new object());
    public static ApiResponse<object> Failure(string message, object? data = null) => new(false, message, data ?? new object());
}
