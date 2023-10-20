using server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// SignalR ���
builder.Services.AddSignalR();

// cors ���
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
            //  cors origin -> Ŭ���̾�Ʈ
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

// Cors ����
app.UseCors();

app.MapRazorPages();

// Hub Route
app.MapHub<ChatHub>("/chatHub");

app.Run();
