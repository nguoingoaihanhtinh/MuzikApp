using Muzik.Helpers;
using Muzik.Interfaces;

namespace Muzik.Services;

public class FileService : IFileService
{
    private readonly Cloudinary _cloudinary;
    private readonly string _folderRoot;

    public FileService(IOptions<CloudinarySettings> cloudinaryConfig, IOptions<FileSettings> fileSettings)
    {
        var settings = cloudinaryConfig.Value;

        Console.WriteLine($"CloudName: {settings.CloudName}");
        Console.WriteLine($"ApiKey: {settings.ApiKey}");
        Console.WriteLine($"ApiSecret: {settings.ApiSecret}");

        if (string.IsNullOrWhiteSpace(settings.CloudName) ||
            string.IsNullOrWhiteSpace(settings.ApiKey) ||
            string.IsNullOrWhiteSpace(settings.ApiSecret))
        {
            throw new ArgumentException("Invalid Cloudinary settings provided!");
        }
            var acc = new Account(
            cloudinaryConfig.Value.CloudName,
            cloudinaryConfig.Value.ApiKey,
            cloudinaryConfig.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(acc);
        _folderRoot = fileSettings.Value.FolderRoot; 
    }

    public async Task<DeletionResult> DeleteFileAsync(string publicId, ResourceType resourceType)
    {
        var deletionParams = new DeletionParams(publicId)
        {
            ResourceType = resourceType
        };

        var deletionResult = await _cloudinary.DestroyAsync(deletionParams);
        return deletionResult;
    }

    public async Task<UploadResult> UploadAudioAsync(string folderPath, IFormFile file)
    {
        var uploadResult = new VideoUploadResult();

        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = _folderRoot + folderPath
            };

            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<UploadResult> UploadLyricAsync(string folderPath, IFormFile file)
    {
        var uploadResult = new RawUploadResult();
        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = _folderRoot + folderPath
            };

            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<ImageUploadResult> UploadImageAsync(string folderPath, IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = _folderRoot + folderPath
            };

            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }
}
