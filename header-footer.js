exports.header = {
    height: '120pt',
    contents: function(pageNum) {
        return `
            <div style="text-align: center; margin-top: 20pt;">
                <div style="width: 270px; height: 81px; background: #999999; margin: 0 auto;"></div>
            </div>
        `;
    }
};

exports.footer = {
    height: '150pt',
    contents: function(pageNum) {
        return '';  // Contact box is handled by CSS positioning
    }
};
