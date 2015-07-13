using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace AzureLens.Controllers
{
    public class GitHubController : ApiController
    {
        // GET: api/GitHub
        [Route("api/GitHub/{file}")]
        public async Task<HttpResponseMessage> Get(string file)
        {
            try
            {
                byte[] data = Convert.FromBase64String(file);
                string fileDecoded = Encoding.UTF8.GetString(data);

                string result = "";
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
                    result = await client.GetStringAsync("https://raw.githubusercontent.com/" + fileDecoded);
                }

                var res = Request.CreateResponse(HttpStatusCode.OK);
                res.Content = new StringContent(result, Encoding.UTF8, "application/json");

                return res;
            }
            catch (Exception ex)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent("Could not download file from GitHub"),
                    ReasonPhrase = "Error when attempting to download file from GitHub: " + ex.Message
                };
                throw new HttpResponseException(resp);
               
            }
        }

    }
}
