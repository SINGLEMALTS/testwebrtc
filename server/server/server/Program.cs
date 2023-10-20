using server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// SignalR 등록
builder.Services.AddSignalR();

// cors 등록
//builder.WithOrigins("http://localhost:5500")

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyHeader()
                   .AllowAnyMethod()
                   .SetIsOriginAllowed((host) => true)
                   .AllowCredentials();
            //builder.WithOrigins("http://localhost:5173")
            //    .AllowAnyHeader()
            //    .WithMethods("GET", "POST")
            //    .SetIsOriginAllowed((host) => true)
            //    .AllowCredentials();
            //  cors origin -> 클라이언트
            //  same origin ->
            
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// Cors 적용
app.UseCors();

app.MapRazorPages();

// Hub Route
app.MapHub<ChatHub>("/chatHub");

app.Run();
