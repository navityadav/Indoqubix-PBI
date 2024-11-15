
using SomatusAnalytics.Common;
using SomatusAnalytics.DatabaseModel;
using SomatusAnalytics.Models;
using System;
using System.Linq;

namespace SomatusAnalytics.Services
{
    public class StaticContentService
    {
        public const string blankPlaceHolderText= "__BLANK__";
        public bool setStaticConent(int clientId, String contentURI, ac_static_content[] contents,string reqType)
        {
            if (contents != null)
            {
                StaticContentConfig oStaticContentConfig = new StaticContentConfig();

                try
                {
                    using (DBModel db = new DBModel())
                    {
                        if (reqType == "UPD")
                        {
                            //DELETE  ALL existing static content
                            var contentList = db.ac_static_content.Where(a => a.client_id == clientId && a.uri.Equals(contentURI)).ToList<ac_static_content>();

                            if (contentList != null)
                            {
                                foreach (ac_static_content content in contentList)
                                {
                                    db.ac_static_content.Remove(content);
                                }
                                db.SaveChanges();
                            }

                        }

                        //Add All Roles to Menu
                        foreach (ac_static_content content in contents)
                        {
                            content.uri = contentURI;
                            content.updated_by = UserContextManager.getUserName();
                            content.updated_on = DateTime.Now;
                            content.is_deleted = "N";

                            //Skip Blank Placeholders..
                            if (string.IsNullOrWhiteSpace(content.placeholder_text))
                            {
                                content.placeholder_text= blankPlaceHolderText;
                            }
                       

                            db.ac_static_content.Add(content);

                            db.SaveChanges();
                        }
                    }

                }
                catch (System.Data.Entity.Infrastructure.DbUpdateConcurrencyException ex)
                {
                    Console.WriteLine(ex.InnerException);
                    return false;
                }
                catch (System.Data.Entity.Core.EntityCommandCompilationException ex)
                {
                    Console.WriteLine(ex.InnerException);
                    return false;
                }
                catch (System.Data.Entity.Core.UpdateException ex)
                {
                    Console.WriteLine(ex.InnerException);
                    return false;
                }

                catch (System.Data.Entity.Infrastructure.DbUpdateException ex) //DbContext
                {
                    Console.WriteLine(ex.InnerException);
                    return false;
                }

                catch (Exception ex)
                {
                    Console.WriteLine(ex.InnerException);
                    return false;
                }
              
            }
            return true;
        }

        public StaticContentConfig getStaticConent(int clientId, String contentURI)
        {
            StaticContentConfig oStaticContentConfig = new StaticContentConfig();

            using (DBModel db = new DBModel())
            {

                /** get Template Id */
                var menu = db.ac_menu.Where(a => a.client_id == clientId && a.uri.Equals(contentURI)).FirstOrDefault<ac_menu>();
                if (menu == null)
                {

                    oStaticContentConfig.ErrorMessage = Common.Messages.RESOURCE_NOT_AVAILABLE;

                }
                else
                {

                    var template_id = menu.static_content_template_id;
                    var staticContent = db.ac_static_content_template.Where(a => a.template_id == template_id).FirstOrDefault<ac_static_content_template>();

                    var staticContentBlockList = db.ac_static_content.Where(a => a.client_id == clientId && a.uri.Equals(contentURI)).ToList<ac_static_content>();
                    if (staticContent == null)
                    {
                        oStaticContentConfig.ErrorMessage = "CONTENT NOT AVAILABLE";
                    }
                    else
                    {
                        /** Replace placeholders **/
                        foreach (var staticBlock in staticContentBlockList) // Loop through List with foreach
                        {
                            if (staticBlock.placeholder_text == blankPlaceHolderText) {
                                staticBlock.placeholder_text = "";
                            }
                            staticContent.template = staticContent.template.Replace(staticBlock.placeholder, staticBlock.placeholder_text);
                        }
                        oStaticContentConfig.content = staticContent.template;
                    }

                }
                return oStaticContentConfig;
            }


        }
    }
}