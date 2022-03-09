import React from 'react';
import { CodeBox } from './CodeBox';
import { ReactDoc } from '../ReactDoc';
import './index.css';

export const Playground = ({ data, children }) => {
  const { filename, meta, highlightedCode, highlightedStyle, markdownContent, readme, reactDocs } = data;

  // add style scope
  let htmlContent = markdownContent || '';
  const matchCss = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
  if (matchCss) {
    const matchContent = matchCss[1];
    const replaceContent = matchContent
      .split('}')
      .map((content) => {
        let cssContent = content;
        if (content[0] === '.') {
          cssContent = `#${filename} ${cssContent}`;
        }
        return `${cssContent}`;
      })
      .join('}');
    htmlContent = htmlContent.replace(matchContent, replaceContent);
  }
  return (
    <div>
      {renderMeta(meta)}
      {renderReadMe(readme)}
      <div className="preview">
        {renderMarkdownContent(htmlContent)}
        <CodeBox filename={filename} highlightedCode={highlightedCode} highlightedStyle={highlightedStyle}>
          {children}
        </CodeBox>
      </div>
      {reactDocs?.map((docData) => (
        <ReactDoc key={docData.filename} data={docData} heading="h4" />
      ))}
    </div>
  );
};

/**
 * 渲染 README 文档
 */
function renderReadMe(readme = undefined) {
  if (!readme) return null;
  return renderMarkdownContent(readme);
}

/** 渲染 Meta 元素 */
function renderMeta(meta) {
  if (!meta) return null;
  return (
    <div className="meta">
      <ul className="meta-list">
        {meta.map((item) => {
          return (
            <li className="meta-item">
              {item.key}: {item.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 渲染MarkDown内容 */
function renderMarkdownContent(markdownContent) {
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: markdownContent }} />;
}
