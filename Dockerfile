# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0.101 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["Directory.Packages.props", "./"]
COPY ["src/Domain/ShoppingProject.Domain.csproj", "src/Domain/"]
COPY ["src/Application/ShoppingProject.Application.csproj", "src/Application/"]
COPY ["src/Infrastructure/ShoppingProject.Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/Presentation/API/ShoppingProject.WebApi.csproj", "src/Presentation/API/"]

RUN dotnet restore "src/Presentation/API/ShoppingProject.WebApi.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/Presentation/API"
RUN dotnet build "ShoppingProject.WebApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ShoppingProject.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0.1 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ShoppingProject.WebApi.dll"]
