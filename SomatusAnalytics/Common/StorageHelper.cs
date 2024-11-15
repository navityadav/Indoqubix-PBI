using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using System;
using System.IO;



namespace SomatusAnalytics.Common
{
    public class StorageHelper
    {
        // Storage account credentials
        public const string StorageAccountName = "stopbidevbatch";
        public const string StorageAccountKey = "s=";
        public const string StorageContainer = "reportsoutput";


        public void SaveFileToStorage(string filePath)
        {
            // Create the blob client, for use in obtaining references to blob storage containers
            CloudBlobClient blobClient = CreateCloudBlobClient(StorageAccountName, StorageAccountKey);

            // Use the blob client to create the input container in Azure Storage 
          

            CloudBlobContainer container = blobClient.GetContainerReference(StorageContainer);

            container.CreateIfNotExistsAsync().Wait();

            UploadFileToStorage(blobClient, StorageContainer, filePath);
        }

        public MemoryStream StorageFileReference( string fileName)
        {
            // Create the blob client, for use in obtaining references to blob storage containers
            CloudBlobClient blobClient = CreateCloudBlobClient(StorageAccountName, StorageAccountKey);

            // Use the blob client to create the input container in Azure Storage 
            CloudBlobContainer container = blobClient.GetContainerReference(StorageContainer);
            CloudBlockBlob fileBlob = container.GetBlockBlobReference(fileName);

            var memoryStream = new MemoryStream();
            
            fileBlob.DownloadToStreamAsync(memoryStream);
            
            return memoryStream;
          

        }

        public string GetFileURI(string fileName)
        {
            CloudBlobClient blobClient = CreateCloudBlobClient(Settings.STORAGE_ACCOUNT_NAME, Settings.STORAGE_ACCOUNT_KEY);

            // Use the blob client to create the input container in Azure Storage 
            CloudBlobContainer container = blobClient.GetContainerReference(Settings.STORAGE_CONTAINER);
            CloudBlockBlob fileBlob = container.GetBlockBlobReference(fileName);


            var sas = fileBlob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
            {
                Permissions = SharedAccessBlobPermissions.Read,
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(15)//Set this date/time according to your requirements
            });
            var url = string.Format("{0}{1}", fileBlob.Uri, sas);//This is the URI which should be embedded
            return url;
           
        }

        /// <summary>
        /// Creates a blob client
        /// </summary>
        /// <param name="storageAccountName">The name of the Storage Account</param>
        /// <param name="storageAccountKey">The key of the Storage Account</param>
        /// <returns></returns>
        private CloudBlobClient CreateCloudBlobClient(string storageAccountName, string storageAccountKey)
        {
            // Construct the Storage account connection string
            string storageConnectionString =
                $"DefaultEndpointsProtocol=https;AccountName={storageAccountName};AccountKey={storageAccountKey}";

            // Retrieve the storage account
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

            // Create the blob client
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            return blobClient;
        }

        public void SaveStreamToStorage(MemoryStream ms, string filePath)
        {
            // Create the blob client, for use in obtaining references to blob storage containers
            CloudBlobClient blobClient = CreateCloudBlobClient(StorageAccountName, StorageAccountKey);

            // Use the blob client to create the input container in Azure Storage 
            const string inputContainerName = "reportoutput";

            CloudBlobContainer container = blobClient.GetContainerReference(inputContainerName);

            container.CreateIfNotExistsAsync().Wait();

            UploadMemoryStreamToStorage(blobClient, ms, inputContainerName, filePath);
        }

        private void UploadMemoryStreamToStorage(CloudBlobClient blobClient, MemoryStream ms, string containerName, string filePath)
        {
            string blobName = Path.GetFileName(filePath);
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlockBlob blobData = container.GetBlockBlobReference(blobName);

            blobData.UploadFromStreamAsync(ms);
            ms.Seek(0, SeekOrigin.Begin);
            blobData.Properties.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            blobData.SetProperties();
            blobData.UploadFromStream(ms);
           

        }
        /// <summary>
        /// Uploads the specified file to the specified Blob container.
        /// </summary>
        /// <param name="blobClient">A <see cref="CloudBlobClient"/>.</param>
        /// <param name="containerName">The name of the blob storage container to which the file should be uploaded.</param>
        /// <param name="filePath">The full path to the file to upload to Storage.</param>
        /// <returns>A ResourceFile instance representing the file within blob storage.</returns>
        private void UploadFileToStorage(CloudBlobClient blobClient, string containerName, string filePath)
        {
            Console.WriteLine("Uploading file {0} to container [{1}]...", filePath, containerName);

            string blobName = Path.GetFileName(filePath);

            filePath = Path.Combine(Environment.CurrentDirectory, filePath);

            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlockBlob blobData = container.GetBlockBlobReference(blobName);
            blobData.UploadFromFileAsync(filePath).Wait();

            // Set the expiry time and permissions for the blob shared access signature. 
            // In this case, no start time is specified, so the shared access signature 
            // becomes valid immediately
            SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy
            {
                SharedAccessExpiryTime = DateTime.UtcNow.AddHours(2),
                Permissions = SharedAccessBlobPermissions.Read
            };

        }

        private string GetFileURI(CloudBlobContainer container, string fileName)
        {
            CloudBlockBlob fileBlob = container.GetBlockBlobReference(fileName);
            var sas = fileBlob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
            {
                Permissions = SharedAccessBlobPermissions.Read,
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(15)//Set this date/time according to your requirements
            });
            var url = string.Format("{0}{1}", fileBlob.Uri, sas);//This is the URI which should be embedded
            return url;
            throw new NotImplementedException();
        }
    }
}