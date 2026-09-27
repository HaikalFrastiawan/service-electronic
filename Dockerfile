# 1. Build Stage: Kompilasi project menggunakan Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Run Stage: Gunakan JRE Alpine yang sangat ringan
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Membatasi konsumsi RAM maksimal 75% agar aman di Render (Free Tier 512MB)
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]