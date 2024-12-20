// This is just a quick hack and needs removing when we  
// clarified where the html tags really come from in the 
// label text when using <> in rdmo. Maybe a bug.

export function stripHtml(html) {
    if (!html) return '';
    // First unescape the text (convert &lt; to <, &gt; to >, etc)
    let text = html.replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&amp;/g, '&')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&nbsp;/g, ' ')
                   .replace(/&#160;/g, ' ');
    
    // Then remove all HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Remove extra whitespace and normalize spaces
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}
