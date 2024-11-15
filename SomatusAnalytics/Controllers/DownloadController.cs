using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using SomatusAnalytics.Common;
using SomatusAnalytics.Infrastructure;
using SomatusAnalytics.Models;
using SomatusAnalytics.Services;
using System;
using System.IO;
using System.Web.Mvc;

namespace SomatusAnalytics.Controllers
{

    public class DownloadController : Controller
    {

        /** Method to Download file from Storage */
        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public void file()
        {
            var reportURI = Request.Url.Segments[3];
            int reportId = Int32.Parse(reportURI);
            int userId = Common.UserContextManager.getUserId();

            try
            {

                ReportExportService oReportExportService = new ReportExportService();
                var export = oReportExportService.getReportBuilderExportRequest(userId, reportId);
                
                // Construct the Storage account connection string
                string storageConnectionString =
                    $"DefaultEndpointsProtocol=https;AccountName={Settings.STORAGE_ACCOUNT_NAME};AccountKey={Settings.STORAGE_ACCOUNT_KEY}";

                // Retrieve the storage account
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

                // Create the blob client
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();


                // Use the blob client to create the input container in Azure Storage 
                CloudBlobContainer container = blobClient.GetContainerReference(Settings.STORAGE_CONTAINER);
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(export.download_path);

                //fileBlob.DownloadToFile(result, FileMode.OpenOrCreate);
                MemoryStream memStream = new MemoryStream();

                blockBlob.DownloadToStream(memStream);

                Response.ContentType = blockBlob.Properties.ContentType.ToString();
                Response.AddHeader("Content-Disposition", "Attachment; filename=" + blockBlob.Name.ToString());

                Response.AddHeader("Content-Length", blockBlob.Properties.Length.ToString());
                Response.BinaryWrite(memStream.ToArray());
                Response.StatusCode=200;
                Response.Flush();
                Response.Close();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                Response.Write(ex.StackTrace);
            }
        }

        [IQAuthrizationFilter("CLIENT_SUPPORT")]
        public ActionResult previewpdf() {
            var result = new PreviewPDFConfig();
            var reportURI = Request.Url.Segments[3];
            int reportId = Int32.Parse(reportURI);
            int userId = Common.UserContextManager.getUserId();
            var fileURI = "";
            try
            {
                /** Get Report Info from history*/
                ReportExportService oReportExportService = new ReportExportService();
                var export = oReportExportService.getReportBuilderExportRequest(userId, reportId);


                StorageHelper oStorageHelper = new StorageHelper();
                fileURI = oStorageHelper.GetFileURI(export.download_path);
                
               // fileURI = "https://demos.codexworld.com/embed-pdf-document-file-in-html-web-page/files/Brochure.pdf";
               
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                Response.Write(ex.StackTrace);
                result.error = "DOC_EXCEPTION";
                return View("preview", result.error);
            }
            result.fileURL = fileURI;
            return View("preview", result);

        }




    }
}