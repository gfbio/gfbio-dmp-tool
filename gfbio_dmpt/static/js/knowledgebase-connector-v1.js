function KnowledgebaseHtmlCreator(knowledgebaseUrl) {
    return {
        knowledgebaseConnector: KnowledgebaseConnector(knowledgebaseUrl),
        textFields: {
            search: {
                label: "Search:",
                placeholder: "Search phrase"
            },
            teaser: {
                showMore: "more details ...",
                showLess: "hide details ...",
            },
            gotoSource: "View article"
        },

        createWithSearch: function(htmlElement, basePageId) {
            var id = "faq-search-input-" + Math.random() * 10000;
            var search = document.createElement("div");
            search.className = "faq-search";
            htmlElement.appendChild(search);

            var list = document.createElement("div");
            list.className = "faq-list";
            htmlElement.appendChild(list);
            this.createListFromBasePage(list, basePageId);

            var searchLabel = document.createElement("label");
            searchLabel.className = "faq-search-input-label";
            searchLabel.htmlFor = id;
            searchLabel.innerText = this.textFields.search.label;
            search.appendChild(searchLabel);

            var searchField = document.createElement("input");
            searchField.className = "faq-search-input";
            searchField.id = id;
            searchField.placeholder = this.textFields.search.placeholder;
            search.appendChild(searchField);
            searchField.oninput = (ev) => {
                this.knowledgebaseConnector.search(
                    ev.target.value,
                    data => {
                        list.innerHTML = "";
                        this.createList(list, data.map(element => element.id));
                    }
                );
                return false;
            }
        },

        createListFromBasePage: function(htmlElement, basePageId) {
            this.knowledgebaseConnector.fetchSubPages(
                basePageId,
                (list) => this.createList(htmlElement, list.map(element => element.id))
            )
        },

        createList: function(htmlElement, idsArray) {
            for (let index = 0; index < idsArray.length; index++) {
                const element = idsArray[index];
                this.createEntry(htmlElement, element)
            }
        },

        createEntry: function(htmlElement, id) {
            var entry = document.createElement("div");
            entry.className = "faq-element";
            htmlElement.appendChild(entry);

            this.knowledgebaseConnector.fetchPageAsQnA(id, article => this._createEntry(entry, article));
        },

        _createEntry: function(htmlElement, article) {
            var elementHeader = document.createElement("div");
            elementHeader.className = "faq-element-header";
            htmlElement.appendChild(elementHeader);

            var question = document.createElement("div");
            question.className = "faq-question"
            question.innerHTML = article.title;
            elementHeader.appendChild(question);

            var linkBox = document.createElement("div");
            linkBox.className = "faq-link";
            elementHeader.appendChild(linkBox);
            var link = document.createElement("a");
            link.className = "faq-link";
            link.href = article.url;
            link.target = "_blank";
            link.innerHTML = this.textFields.gotoSource;
            linkBox.appendChild(link);
        
            var shortAnswer = document.createElement("div");
            shortAnswer.className = "faq-shortAnswer";
            shortAnswer.innerHTML = article.shortAnswer;
            htmlElement.appendChild(shortAnswer);
        
            var longAnswer = document.createElement("div");
            longAnswer.className = "faq-longAnswer collapsed";
            longAnswer.innerHTML = article.longAnswer;
            htmlElement.appendChild(longAnswer);
        
            var longAnswerTeaser = document.createElement("div");
            longAnswerTeaser.className = "faq-longAnswerTeaser";
            longAnswerTeaser.innerHTML = this.textFields.teaser.showMore;
            htmlElement.appendChild(longAnswerTeaser);
        
            longAnswerTeaser.onclick = () => {
                if(longAnswer.className == "faq-longAnswer extended") {
                    longAnswer.className = "faq-longAnswer collapsed";
                    longAnswerTeaser.innerHTML = this.textFields.teaser.showMore;
                    longAnswerTeaser.className = "faq-longAnswerTeaser show-more";
                }
                else {
                    longAnswer.className = "faq-longAnswer extended";
                    longAnswerTeaser.innerHTML = this.textFields.teaser.showLess;
                    longAnswerTeaser.className = "faq-longAnswerTeaser show-less";
                }
            }
        }
    }
}

function KnowledgebaseConnector(knowledgebaseUrl) {
    return {
        knowledgebaseUrl: knowledgebaseUrl ? knowledgebaseUrl : "https://kb.gfbio.org",
        space: "KB",

        search: function(searchString, handleSearchResult) {
            var url = "rest/api/content/search?cql=" + encodeURIComponent("space=" + this.space + " AND siteSearch ~ \"" + searchString + "\"");
            this.fetchData(url, json => {
                var data = this.mapResults(json);
                handleSearchResult(data);
            });
        },

        fetchSubPages(pageId, handleResult) {
            var url = "rest/api/content/" + pageId + "/child/page";
            this.fetchData(url, json => {
                var data = this.mapResults(json);
                handleResult(data);
            });
        },

        fetchPageAsQnA(id, handleResult) {
            this.fetchPage(
                id,
                page => {
                    var match = /<h3 .*?>Short Answer<\/h3>(.*)<h3 .*>Detailed Answer<\/h3>(.*)/.exec(page.content);
                    var longAnswerWithCorrectedImageLinks = match[2].replace(/<img .*?src=("\/.*?"|'\/.*?').*?>/g, (fullMatch, group) => {
                        return fullMatch.replace(group, group.substring(0,1) + this.knowledgebaseUrl + group.substring(1));
                    }); // adds kb-url to image-links starting with /
                    var article = {
                        title: page.title,
                        shortAnswer: match[1],
                        longAnswer:  longAnswerWithCorrectedImageLinks,
                        url: this.knowledgebaseUrl + "/pages/viewpage.action?pageId=" + id,
                    }
                    handleResult(article);
                }
            )
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