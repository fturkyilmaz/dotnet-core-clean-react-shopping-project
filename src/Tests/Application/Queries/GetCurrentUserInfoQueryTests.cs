using Bogus;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.Identity.Queries.GetCurrentUserInfo;

namespace ShoppingProject.UnitTests.Application.Queries;

public class GetCurrentUserInfoQueryTests
{
    private readonly Mock<IIdentityService> _mockIdentityService;
    private readonly Mock<IUser> _mockUser;
    private readonly Faker _faker;

    public GetCurrentUserInfoQueryTests()
    {
        _mockIdentityService = new Mock<IIdentityService>();
        _mockUser = new Mock<IUser>();
        _faker = new Faker();
    }

    [Fact]
    public async Task GetCurrentUserInfo_ShouldFail_WhenUserIdIsMissing()
    {
        // Arrange: UserId boş
        _mockUser.Setup(u => u.Id).Returns(string.Empty);

        var handler = new GetCurrentUserInfoQueryHandler(
            _mockIdentityService.Object,
            _mockUser.Object
        );

        // Act
        var result = await handler.Handle(new GetCurrentUserInfoQuery(), CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Unauthorized", result.Message);
    }

    [Fact]
    public async Task GetCurrentUserInfo_ShouldSucceed_WhenUserIdIsValid()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        _mockUser.Setup(u => u.Id).Returns(userId);

        var fakeUser = new UserInfoResponse(
            userId,
            _faker.Internet.Email(),
            _faker.Name.FirstName(),
            _faker.Name.LastName(),
            _faker.Internet.UserName(),
            "Male",
            new List<string> { "Client" }
        );

        _mockIdentityService
            .Setup(s => s.GetUserInfoAsync(userId))
            .ReturnsAsync(ServiceResult<UserInfoResponse>.Success(fakeUser));

        var handler = new GetCurrentUserInfoQueryHandler(
            _mockIdentityService.Object,
            _mockUser.Object
        );

        // Act
        var result = await handler.Handle(new GetCurrentUserInfoQuery(), CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(userId, result.Data.Id);
        Assert.Contains("Client", result.Data.Roles);
    }
}
