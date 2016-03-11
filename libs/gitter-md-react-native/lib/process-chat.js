import React, {View, Text} from 'react-native'
import katex from 'katex'
import marked from 'gitter-marked'
import matcher from './github-url-matcher'
import s from './styles'

const options = {
  gfm: true,
  tables: true,
  sanitize: true,
  breaks: true,
  linkify: true,
  skipComments: true
}

const lexer = new marked.Lexer(options);

const JAVA = 'java';
const SCRIPT = 'script:';
const scriptUrl = JAVA + SCRIPT;
const dataUrl = 'data:';
const httpUrl = 'http://';
const httpsUrl = 'https://';
const noProtocolUrl = '//';


function checkForIllegalUrl(href) {
  if(!href) return "";

  href = href.trim();
  const hrefLower = href.toLowerCase();

  if(hrefLower.indexOf(scriptUrl) === 0 || hrefLower.indexOf(dataUrl) === 0) {
    /* Rickroll the script kiddies */
    return "http://goo.gl/a7HIYr";
  }

  if(hrefLower.indexOf(httpUrl) !== 0 && hrefLower.indexOf(httpsUrl) !== 0 && hrefLower.indexOf(noProtocolUrl) !== 0)  {
    return httpUrl + href;
  }

  return href;
}

function getRenderer() {

  const renderer = new marked.Renderer();

  // Highlight code blocks
  renderer.code = function(code, lang) {
    return (
      <View style={s.codeBlockContainer}>
        <Text style={s.codeBlockText}>
          {code}
        </Text>
      </View>
    )
  };

  // Highlight code blocks
  renderer.latex = function(latexCode) {
    try {
      const content = katex.renderToString(latexCode)
      return (
        <View style={s.codeBlockContainer}>
          <Text style={s.latex}>
            {content}
          </Text>
        </View>
      )
    } catch(e) {
      return (
        <View style={s.codeBlockContainer}>
          <Text style={s.latex}>
            Error to process {latexCode}
          </Text>
        </View>
      )
    }
  };

  // Extract urls mentions and issues from paragraphs
  renderer.paragraph = function(text) {
    return (
      <Text style={s.text}>
        {text}
      </Text>
    )
  };

  renderer.issue = function(repo, issue, text) {
    return (
      <Text style={s.issue}>
        {text}
      </Text>
    )
    // var out = '<span data-link-type="issue" data-issue="' + issue + '"';
    // if(repo) {
    //   out += util.format(' data-issue-repo="%s"', repo);
    // }
    // out += ' class="issue">' + text + '</span>';
    // return out;
  };

  renderer.commit = function(repo, sha) {
    var text = repo+'@'+sha.substring(0, 7);
    // var out = '<span data-link-type="commit" ' +
    //           'data-commit-sha="' + sha + '" ' +
    //           'data-commit-repo="' + repo + '" ' +
    //           'class="commit">' + text + '</span>';

    return (
      <Text style={s.commit}>
        {text}
      </Text>
    )
  };

  renderer.link = function(href, title, text) {
    href = checkForIllegalUrl(href);
    var githubData = matcher(href);
    // if(githubData) {
    //   return renderer[githubData.type](githubData.repo, githubData.id, githubData.text);
    // } else {
    //   renderContext.urls.push({ url: href });
    //   return util.format('<a href="%s" rel="nofollow" target="_blank" class="link">%s</a>', href, text);
    // }
    return (
      <Text style={s.link}>
        {href}
      </Text>
    )
  };

  renderer.image = function(href, title, text) {
    href = checkForIllegalUrl(href);
    return (
      <Text style={s.image}>
        {href}
      </Text>
    )
  };

  renderer.mention = function(href, title, text) {
    var screenName = text.charAt(0) === '@' ? text.substring(1) : text;
    return (
      <Text style={s.mention}>
        {text}
      </Text>
    )
  };

  renderer.groupmention = function(name, text) {
    return (
      <Text style={s.groupMention}>
        {text}
      </Text>
    )
  };

  renderer.email = function(href, title, text) {
    checkForIllegalUrl(href);
    return (
      <Text style={s.email}>
        {text}
      </Text>
    )
  };

  renderer.heading = function(text, level/*, raw */) {
    const headingLevelStyles = `heading${level}`
    return (
      <Text style={s[headingLevelStyles]}>
        {text}
      </Text>
    )
  };

  renderer.text = function(text) {
    /* Used for language detection */
    return (
      <Text style={s.text}>
        {text}
      </Text>
    )
  };

  renderer.blockquote = function(text) {
    return (
      <View style={s.blockquote}>
        <Text style={s.blockquoteText}>
          {text}
        </Text>
      </View>
    )
  }

  renderer.list = function(body, ordered) {
    return (
      <View style={s.list}>
        {body}
      </View>
    )
  }

  renderer.listitem = function(body, ordered) {
    return (
      <Text style={s.listItem}>
        {body}
      </Text>
    )
  }

  renderer.strong = function(text) {
    return (
      <Text style={s.strong}>
        {text}
      </Text>
    )
  }

  renderer.em = function(text) {
    return (
      <Text style={s.em}>
        {text}
      </Text>
    )
  }

  renderer.codeSpan = function(text) {
    return (
      <Text style={s.codeSpan}>
        {text}
      </Text>
    )
  }

  return renderer;
}

export default function processChat(text) {
  const renderer = getRenderer();
  const content = marked(text, { renderer })
  // var tokens = lexer.lex(text);
  // var parser = new marked.Parser(Object.assign({ renderer: renderer }, options))
  // const content = parser.parse(tokens);
  debugger

  return content
}
