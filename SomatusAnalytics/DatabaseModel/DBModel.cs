namespace SomatusAnalytics.DatabaseModel
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class DBModel : DbContext
    {
        public DBModel()
            : base("name=DBModel")
        {
        }
        public virtual DbSet<ac_client_master> ac_client_master { get; set; }
        public virtual DbSet<ac_client_user_mapping> ac_client_user_mapping { get; set; }
        public virtual DbSet<ac_user_report_filter_mapping> ac_user_report_filter_mapping { get; set; }
        
        public virtual DbSet<ac_user_role_mapping> ac_user_role_mapping { get; set; }
        public virtual DbSet<ac_menu_role_mapping> ac_menu_role_mapping { get; set; }
        public virtual DbSet<ac_role_master> ac_role_master { get; set; }

        public virtual DbSet<ac_menu> ac_menu { get; set; }
        public virtual DbSet<ac_powerbi_report> ac_powerbi_report { get; set; }
        public virtual DbSet<ac_report_builder_db_setting> ac_report_builder_db_setting { get; set; }
        public virtual DbSet<ac_report_builder_userdefined> ac_report_builder_userdefined { get; set; }
        public virtual DbSet<ac_static_content> ac_static_content { get; set; }
        public virtual DbSet<ac_static_content_template> ac_static_content_template { get; set; }
        public virtual DbSet<ac_subscribe> ac_subscribe { get; set; }
        public virtual DbSet<ac_user_master> ac_user_master { get; set; }
        public virtual DbSet<view_user_menu> view_user_menu { get; set; }
        public virtual DbSet<ac_bi_access_app> ac_bi_access_app { get; set; }
        public virtual DbSet<ac_issues> ac_issues { get; set; }
        public virtual DbSet<ac_contactus> ac_contactus { get; set; }
        public virtual DbSet<ac_report_builder_source_table> ac_report_builder_source_table { get; set; }
        public virtual DbSet<ac_system_setting> ac_system_setting { get; set; }
        public virtual DbSet<ac_user_access_log> ac_user_access_log { get; set; }
        public virtual DbSet<database_firewall_rules> database_firewall_rules { get; set; }
        public virtual DbSet<ac_report_export_history> ac_report_export_history { get; set; }
        public virtual DbSet<ac_report_published> ac_report_published { get; set; }

        public virtual DbSet<ac_email_template> ac_email_template { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ac_email_template>()
                  .Property(e => e.mode)
                  .IsUnicode(false);

            modelBuilder.Entity<ac_email_template>()
                .Property(e => e.subject)
                .IsUnicode(false);

            modelBuilder.Entity<ac_email_template>()
                .Property(e => e.template_content)
                .IsUnicode(false);

            modelBuilder.Entity<ac_email_template>()
                .Property(e => e.template_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_published>()
                .Property(e => e.report_type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_published>()
                .Property(e => e.ref_uri)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_export_history>()
                .Property(e => e.email_id)
                .IsUnicode(false);
            
            modelBuilder.Entity<ac_report_export_history>()
                .Property(e => e.download_path)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_export_history>()
                .Property(e => e.subject)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_export_history>()
                .Property(e => e.message)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_export_history>()
               .Property(e => e.report_name)
               .IsUnicode(false);


            modelBuilder.Entity<ac_report_export_history>()
                .Property(e => e.reference_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_client_master>()
                .Property(e => e.client_name)
                .IsUnicode(false);

            

            modelBuilder.Entity<ac_client_user_mapping>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

           // view_user_menu

            modelBuilder.Entity<ac_user_report_filter_mapping>()
                .Property(e => e.updated_by)
                .IsUnicode(false);


            modelBuilder.Entity<ac_menu>()
                .Property(e => e.category)
                .IsUnicode(false);

            modelBuilder.Entity<ac_menu>()
                .Property(e => e.module_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_menu>()
                .Property(e => e.uri)
                .IsUnicode(false);

            modelBuilder.Entity<ac_menu>()
                .Property(e => e.is_menu)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_menu>()
                .Property(e => e.is_access_controlled)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_menu>()
                .Property(e => e.is_static_content)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.uri)
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.title)
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.subtitle)
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.workspace_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.report_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.show_filter)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_powerbi_report>()
                .Property(e => e.show_tab)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.db_server)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.db_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.db_type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.db_username)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.db_password)
                .IsUnicode(false);

          modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.db_read_only)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_db_setting>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_userdefined>()
                .Property(e => e.report_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_userdefined>()
                .Property(e => e.table_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_userdefined>()
                .Property(e => e.dataselection_json)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_userdefined>()
                .Property(e => e.query)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_userdefined>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

           modelBuilder.Entity<ac_report_builder_userdefined>()
                .Property(e => e.roles)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content>()
                .Property(e => e.uri)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content>()
                .Property(e => e.placeholder)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content>()
                .Property(e => e.placeholder_text)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content_template>()
                .Property(e => e.template_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content_template>()
                .Property(e => e.template)
                .IsUnicode(false);

            modelBuilder.Entity<ac_static_content_template>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
                .Property(e => e.email_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
                .Property(e => e.report_ref_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
                .Property(e => e.report_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
                .Property(e => e.report_type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
                .Property(e => e.frequency)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
                .Property(e => e.type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_subscribe>()
               .Property(e => e.is_deleted)
               .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.login_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.password)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.login_type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.display_Name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.email)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.mobile_no)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.is_deleted)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.is_active)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_master>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.application_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.app_user_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.app_password)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.application_secret)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.tenant)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.authority_uri)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.resoruce_uri)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.updated_on)
                .HasPrecision(3);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.authority_type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_bi_access_app>()
                .Property(e => e.api_url)
                .IsUnicode(false);

            modelBuilder.Entity<ac_issues>()
                .Property(e => e.issue)
                .IsUnicode(false);

            modelBuilder.Entity<ac_issues>()
                .Property(e => e.issue_desc)
                .IsUnicode(false);

            modelBuilder.Entity<ac_issues>()
                .Property(e => e.priority)
                .IsUnicode(false);

            modelBuilder.Entity<ac_issues>()
                .Property(e => e.status)
                .IsUnicode(false);

            modelBuilder.Entity<ac_issues>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            //ContactUs Start.
             modelBuilder.Entity<ac_contactus>()
                .Property(e => e.comments)
                .IsUnicode(false);

            modelBuilder.Entity<ac_contactus>()
                .Property(e => e.report)
                .IsUnicode(false);

            modelBuilder.Entity<ac_contactus>()
                .Property(e => e.subject)
                .IsUnicode(false);

            modelBuilder.Entity<ac_contactus>()
                .Property(e => e.updated_by)
                .IsUnicode(false);
            //contactus end.    

            modelBuilder.Entity<ac_report_builder_source_table>()
                .Property(e => e.table_name)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_source_table>()
               .Property(e => e.display_name)
               .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_source_table>()
                .Property(e => e.fields)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_source_table>()
                .Property(e => e.condition)
                .IsUnicode(false);

            modelBuilder.Entity<ac_report_builder_source_table>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.auth_type)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.ad_authority_url)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.ad_resource_url)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.ad_application_id)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.static_content_base_url)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.static_content_signature)
                .IsUnicode(false);

            modelBuilder.Entity<ac_system_setting>()
                .Property(e => e.updated_by)
                .IsUnicode(false);


            modelBuilder.Entity<ac_user_access_log>()
                .Property(e => e.user_browser)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_access_log>()
                           .Property(e => e.request_type)
                           .IsUnicode(false);

            modelBuilder.Entity<ac_user_access_log>()
                .Property(e => e.user_ip)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_access_log>()
                           .Property(e => e.request_uri)
                           .IsUnicode(false);

            modelBuilder.Entity<database_firewall_rules>()
                .Property(e => e.start_ip_address)
                .IsUnicode(false);

            modelBuilder.Entity<database_firewall_rules>()
                .Property(e => e.end_ip_address)
                .IsUnicode(false);

            //For Roles
            modelBuilder.Entity<ac_role_master>()
                .Property(e => e.role)
                .IsUnicode(false);

            modelBuilder.Entity<ac_user_role_mapping>()
                .Property(e => e.updated_by)
                .IsUnicode(false);

            modelBuilder.Entity<ac_menu_role_mapping>()
                .Property(e => e.updated_by)
                .IsUnicode(false);


        }
    }
}
