using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SettlyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavouriteController : ControllerBase
    {
        private readonly IFavouriteService _favouriteService;

        public FavouriteController(IFavouriteService favouriteService)
        {
            _favouriteService = favouriteService;
        }
        [HttpGet]
        [Authorize]
        [SwaggerOperation(Summary = "Get user favourites")]
        [SwaggerResponse(200, "Successfully retrieved favourites")]
        public async Task<IActionResult> GetFavourites()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            var favourites = await _favouriteService.GetFavourites(userId);
            return Ok(favourites);
        }
        [HttpPost("toggle")]
        [Authorize]
        [SwaggerOperation(Summary = "Toggle a favourite item for the user")]
        [SwaggerResponse(200, "Favourite toggled")]
        public async Task<IActionResult> ToggleFavourite([FromBody] AddFavouriteDto dto)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            var isSaved = await _favouriteService.ToggleFavouriteAsync(dto, userId);
            return Ok(new
            {
                isSaved,
                message = isSaved ? "Favourite added." : "Favourite removed"
            });
        }
        [HttpGet("single")]
        [Authorize]
        [SwaggerOperation(Summary = "Get single favourite by target type and ID")]
        [SwaggerResponse(200, "Successfully retrieved favourite")]
        public async Task<IActionResult> GetSingleFavourite([FromQuery] string targetType, [FromQuery] int targetId)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            var favourite = await _favouriteService.GetSingleFavouriteAsync(targetType, targetId, userId);
            if (favourite == null)
                return Ok(new { isSaved = false });
            return Ok(new
            {
                isSaved = true,
                notes = favourite.Notes,
                priority = favourite.Priority,
                createdAt = favourite.CreatedAt,
            });
        }
    }
}