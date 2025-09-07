
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, PageBreak, Header, Footer, ImageRun, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export interface WordReportData {
  companyInfo: any;
  executiveSummary: any;
  analysisResults: any[];
  language: 'ar' | 'en';
}

export async function generateWordReport(data: WordReportData): Promise<Blob> {
  const doc = new Document({
    creator: 'FinClick.AI',
    title: `Financial Analysis Report - ${data.companyInfo.name}`,
    description: 'Comprehensive Financial Analysis Report',
    styles: {
      default: {
        heading1: {
          run: {
            size: 32,
            bold: true,
            color: 'D4AF37'
          },
          paragraph: {
            spacing: { after: 300 }
          }
        },
        heading2: {
          run: {
            size: 26,
            bold: true,
            color: 'D4AF37'
          },
          paragraph: {
            spacing: { after: 240 }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'FinClick.AI - Financial Analysis Report',
                    color: 'D4AF37',
                    size: 20
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '© 2025 FinClick.AI - All Rights Reserved',
                    color: '808080',
                    size: 18
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        children: [
          ...createCoverPage(data),
          new PageBreak(),
          ...createTableOfContents(data),
          new PageBreak(),
          ...createExecutiveSummary(data),
          new PageBreak(),
          ...createAnalysisSections(data),
          new PageBreak(),
          ...createRecommendations(data)
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

function createCoverPage(data: WordReportData): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'FinClick.AI',
          size: 72,
          bold: true,
          color: 'D4AF37'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.language === 'ar' ? 
            'تقرير التحليل المالي الشامل' : 
            'Comprehensive Financial Analysis Report',
          size: 36,
          color: 'D4AF37'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.companyInfo.name,
          size: 48,
          bold: true
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.companyInfo.sector,
          size: 28
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: new Date().toLocaleDateString(data.language === 'ar' ? 'ar-SA' : 'en-US'),
          size: 24,
          color: '808080'
        })
      ],
      alignment: AlignmentType.CENTER
    })
  ];
}

function createTableOfContents(data: WordReportData): Paragraph[] {
  const contents = [
    { title: data.language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary', page: 3 },
    { title: data.language === 'ar' ? 'التحليل المالي' : 'Financial Analysis', page: 5 },
    { title: data.language === 'ar' ? 'النسب المالية' : 'Financial Ratios', page: 10 },
    { title: data.language === 'ar' ? 'التوصيات' : 'Recommendations', page: 20 }
  ];

  return [
    new Paragraph({
      text: data.language === 'ar' ? 'فهرس المحتويات' : 'Table of Contents',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER
    }),
    ...contents.map(item => 
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.title}`,
            size: 24
          }),
          new TextRun({
            text: `...............................`,
            color: '808080'
          }),
          new TextRun({
            text: `${item.page}`,
            size: 24
          })
        ],
        spacing: { after: 200 }
      })
    )
  ];
}

function createExecutiveSummary(data: WordReportData): Paragraph[] {
  return [
    new Paragraph({
      text: data.language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary',
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.executiveSummary.overview,
          size: 22
        })
      ],
      spacing: { after: 300 }
    }),
    new Paragraph({
      text: data.language === 'ar' ? 'النتائج الرئيسية:' : 'Key Findings:',
      heading: HeadingLevel.HEADING_2
    }),
    ...data.executiveSummary.keyFindings.map((finding: string) => 
      new Paragraph({
        children: [
          new TextRun({
            text: `• ${finding}`,
            size: 22
          })
        ],
        spacing: { after: 100 }
      })
    )
  ];
}

function createAnalysisSections(data: WordReportData): Paragraph[] {
  const sections: Paragraph[] = [];

  data.analysisResults.forEach(analysis => {
    sections.push(
      new Paragraph({
        text: analysis.name,
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: analysis.description || '',
            size: 22
          })
        ],
        spacing: { after: 200 }
      })
    );

    if (analysis.results && analysis.results.length > 0) {
      sections.push(createAnalysisTable(analysis.results, data.language));
    }

    if (analysis.interpretation) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: analysis.interpretation,
              size: 22
            })
          ],
          spacing: { after: 300 }
        })
      );
    }
  });

  return sections;
}

function createAnalysisTable(results: any[], language: 'ar' | 'en'): Table {
  const headers = language === 'ar' ? 
    ['المؤشر', 'القيمة', 'المعيار', 'التقييم'] :
    ['Indicator', 'Value', 'Benchmark', 'Evaluation'];

  return new Table({
    rows: [
      new TableRow({
        children: headers.map(header => 
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: header,
                    bold: true,
                    color: 'FFFFFF'
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ],
            shading: {
              fill: 'D4AF37'
            }
          })
        )
      }),
      ...results.map(result => 
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: result.metric })]
            }),
            new TableCell({
              children: [new Paragraph({ text: result.value?.toString() || '-' })]
            }),
            new TableCell({
              children: [new Paragraph({ text: result.benchmark || '-' })]
            }),
            new TableCell({
              children: [new Paragraph({ text: result.evaluation || '-' })]
            })
          ]
        })
      )
    ],
    width: {
      size: 100,
      type: 'pct'
    }
  });
}

function createRecommendations(data: WordReportData): Paragraph[] {
  return [
    new Paragraph({
      text: data.language === 'ar' ? 'التوصيات' : 'Recommendations',
      heading: HeadingLevel.HEADING_1
    }),
    ...data.executiveSummary.recommendations.map((rec: string, index: number) => 
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${rec}`,
            size: 22
          })
        ],
        spacing: { after: 200 }
      })
    )
  ];
}

export default {
  generateWordReport
};
