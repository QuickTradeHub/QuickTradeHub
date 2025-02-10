# Step 1: Use .NET 8.0 SDK to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /src

# Copy the project file and restore dependencies
COPY OrderServiceProject.csproj ./  # Adjusted path
RUN dotnet restore "OrderServiceProject.csproj"

# Copy the rest of the application code
COPY . .

# Build and publish the application
RUN dotnet publish "OrderServiceProject.csproj" -c Release -o /app

# Step 2: Use .NET 8.0 runtime for the final container (smaller size)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set working directory
WORKDIR /app

# Copy published files from the build stage
COPY --from=build /app .

# Expose the application port
EXPOSE 5142

# Set SQL Server connection string (Ensure correct DB connection)
ENV ConnectionStrings__DefaultConnection="Server=localhost;Database=OrderServiceDb;User Id=sa;Password=Root123;"

# Entry point to run the application
ENTRYPOINT ["dotnet", "OrderServiceProject.dll"]
