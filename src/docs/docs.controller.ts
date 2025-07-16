import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

@ApiTags('docs')
@Controller()
export class DocsController {
  @Get('readme')
  @ApiOperation({
    summary: 'API documentation in HTML',
    description:
      'HTML page with complete API documentation, ideal for beginner users',
  })
  @ApiResponse({
    status: 200,
    description: 'HTML page with documentation',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          example: '<html>...</html>',
        },
      },
    },
  })
  async getReadme(@Res() res: Response): Promise<void> {
    try {
      const docPath = path.join(process.cwd(), 'SWAGGER_DOCUMENTATION.md');
      const markdownContent = fs.readFileSync(docPath, 'utf-8');

      const htmlContent = marked(markdownContent);

      const fullHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL Shortener API - Documentação</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.2em;
        }
        
        .content {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }
        
        .content h1, .content h2, .content h3 {
            color: #667eea;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        .content h1 {
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        
        .content h2 {
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }
        
        .content pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            margin: 15px 0;
        }
        
        .content code {
            background: #f8f9fa;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        
        .content pre code {
            background: none;
            padding: 0;
        }
        
        .content ul, .content ol {
            margin-left: 30px;
            margin-bottom: 15px;
        }
        
        .content li {
            margin-bottom: 8px;
        }
        
        .content blockquote {
            border-left: 4px solid #ffc107;
            background: #fff8e1;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .content th, .content td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .content th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        
        .content tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 8px;
            background: #667eea;
            color: white;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: 600;
            margin-right: 5px;
        }
        
        .swagger-link {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #667eea;
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .swagger-link:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
            color: white;
            text-decoration: none;
        }
        
        .footer {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 30px;
            padding: 20px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .swagger-link {
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 URL Shortener API</h1>
            <p>Documentação Completa da API</p>
        </div>
        
        <div class="content">
            ${htmlContent}
        </div>
        
        <div class="footer">
            <p>📚 Documentação gerada automaticamente • 🔧 API desenvolvida com NestJS</p>
        </div>
    </div>
    
    <a href="/docs" class="swagger-link">
        📋 Testar API no Swagger
    </a>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(fullHtml);
    } catch (error) {
      res.status(500).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #dc3545;">❌ Error loading documentation</h1>
            <p>Could not load the documentation file.</p>
            <p><a href="/docs">🔙 Back to Swagger</a></p>
          </body>
        </html>
      `);
    }
  }
}
