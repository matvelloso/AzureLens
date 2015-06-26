using System.Web;
using System.Web.Optimization;

namespace AzureLens
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery.multilevelpushmenu.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/cssbundle").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/fonts/font-awesome.css",
                      "~/Content/basecss/jquery.multilevelpushmenu.css",
                      "~/Content/basecss/main.css"));

            bundles.Add(new ScriptBundle("~/bundles/babylon").Include(
                     "~/Scripts/Babylon.2.1.fix.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                     "~/Scripts/app.js"));

        }
    }
}
