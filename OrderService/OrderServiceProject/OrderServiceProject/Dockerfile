# Step 1: Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory for the application
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["OrderServiceProject/OrderServiceProject.csproj", "OrderServiceProject/"]
RUN dotnet restore "OrderServiceProject/OrderServiceProject.csproj"

# Copy the rest of the application code to the container
COPY . .

# Build the application and publish it to the /app directory
RUN dotnet publish "OrderServiceProject/OrderServiceProject.csproj" -c Release -o /app

# Step 2: Use the official .NET runtime image for the final container (smaller size)
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Set the working directory for the application in the container
WORKDIR /app

# Copy the published app from the build image to the final image
COPY --from=build /app .

# Step 3: Set environment variables for SQL Server connection
ENV ConnectionStrings__DefaultConnection="Server=sql-server;Database=OrderServiceDb;User Id=sa;Password=Root123!"

# Step 4: Expose the port the application runs on (if needed)
EXPOSE 5142

# Step 5: Define the entry point to run the app
ENTRYPOINT ["dotnet", "OrderServiceProject.dll"]
