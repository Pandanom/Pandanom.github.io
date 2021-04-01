FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ChessApp/ChessApp.csproj ChessApp/
RUN dotnet restore ChessApp/ChessApp.csproj
COPY . .
WORKDIR /src/ChessApp
RUN dotnet build ChessApp.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish ChessApp.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ChessApp.dll"]
