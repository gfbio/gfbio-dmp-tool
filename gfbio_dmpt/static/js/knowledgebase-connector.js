function KnowledgebaseConnector(knowledgebaseUrl) {
    return {
        knowledgebaseUrl: knowledgebaseUrl ? knowledgebaseUrl : "https://kb.gfbio.org",
        space: "KB",

        search: function(searchString, handleSearchResult) {
            var url = "rest/api/content/search?cql=" + encodeURIComponent("space=" + this.space + " AND siteSearch ~ \"" + searchString + "\"");
            this.fetchData(url, json => {
                var data = this.mapResults(json);
                data.forEach(d => handleSearchResult(d));
            });
        },

        fetchSubPages(pageId, handleResult) {
            var url = "rest/api/content/" + pageId + "/child/page";
            this.fetchData(url, json => {
                var data = this.mapResults(json);
                data.forEach(d => handleResult(d));
            });
        },

        fetchPage(pageId, handleResult) {
            var url = "rest/api/content/" + pageId + "?expand=body.storage,body.view";
            this.fetchData(url, json => {
                var data = {
                    title: json.title,
                    content: json.body.view.value
                };
                handleResult(data);
            });
        },

        fetchData: function(url, handleReturnData) {
            fetch(this.knowledgebaseUrl + "/" + url)
                .then(
                    response => response.json().then(handleReturnData)
                );
        },

        mapResults: function(json) {
            return json.results.map(
                r => ({
                    id: r.id,
                    title: r.title,
                    url: this.knowledgebaseUrl + "/pages/viewpage.action?pageId=" + r.id,
                    getContent: (handlePageContent) => {
                        this.fetchPage(r.id, handlePageContent);
                    }
                })
            );
        }
    }
}