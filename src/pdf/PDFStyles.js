export const PDF_STYLES = {
    document: {
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
        margins: {
            all: 40  // Updated to exactly 40pt as per spec
        }
    },
    colors: {
        empireRed: '#E31837',
        darkGray: '#333333',
        mediumGray: '#666666',
        lightGray: '#999999',
        white: '#FFFFFF',
        shadowGray: '#E0E0E0'
    },
    typography: {
        fonts: {
            primary: 'helvetica',
            bold: 'helvetica'
        },
        fontStyles: {
            normal: 'normal',
            bold: 'bold'
        },
        sizes: {
            mainTitle: 20,
            sectionHeader: 12,
            bodyText: 11,
            netProceeds: 12,
            disclaimer: 7
        }
    },
    header: {
        height: 120,  // Space for logo and padding
        logo: {
            width: 270,
            height: 81,
            topMargin: 20  // Space from top of page
        }
    },
    content: {
        spacing: {
            titleToAddress: 25,
            addressToSection: 35,
            noAddressToSection: 10,
            betweenSections: 25,
            lineHeight: 25,
            netToDisclaimer: 15
        }
    },
    footer: {
        height: 150,  // Total footer height
        topMargin: 40,  // Space between content and footer
        contact: {
            width: 250,
            height: 100,
            photo: {
                size: 80,
                border: {
                    width: 3,
                    color: '#E31837'
                }
            },
            text: {
                name: {
                    size: 14,
                    style: 'bold',
                    color: '#333333'
                },
                details: {
                    size: 11,
                    color: '#666666'
                }
            }
        }
    },
    boxEffect: {
        shadowOffset: 4,
        shadowBlur: 3,
        highlightColor: '#FFFFFF',
        shadowColor: '#CCCCCC'
    },
    sections: {
        header: {
            height: 30,
            background: '#E31837',
            textColor: '#FFFFFF'
        }
    }
};