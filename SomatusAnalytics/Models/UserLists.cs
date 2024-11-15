using SomatusAnalytics.DatabaseModel;
using System;
using System.Collections.Generic;

namespace SomatusAnalytics.Models
{
    public class UserLists
    {
        public List<UserModel> users { get; set; }
        public List<ClientModel> clients { get; set; }

        public Dictionary<int, String> roles { get; set; }

        public int userId { get; set; }
        public UserModel selectedUser { get; set; }


        public string loginId { get;set;}

    }
}