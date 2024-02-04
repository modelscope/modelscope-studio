const trimString = (str: string) => {
  return str.replace(/^\s+|\s+$/g, '');
};

const findNextPattern = (text: string, pattern: string, start_pos = 0) => {
  const idx = text.indexOf(pattern, start_pos);
  if (idx < 0) {
    return {
      found: false,
      pos: -1,
    };
  }
  return {
    found: true,
    pos: idx,
  };
};

const consumePattern = (
  text: string,
  patternStart: string,
  patternEnd: string,
  start_pos = 0
) => {
  const flagStart = findNextPattern(text, patternStart, start_pos);
  if (flagStart.found) {
    const flagEnd = findNextPattern(text, patternEnd, flagStart.pos);
    if (flagEnd.found) {
      return {
        pos: flagEnd.pos,
        content: text.substring(
          flagStart.pos + patternStart.length,
          flagEnd.pos
        ),
        finish: true,
      };
    } else {
      return {
        pos: text.length - 1,
        content: text.substring(flagStart.pos + patternStart.length),
        finish: false,
      };
    }
  } else {
    return false;
  }
};

/**
 *

<场景描述>：你在古墓派的后山修炼内功，突然听到远处传来一阵异样的声音。你决定去查看一下。

调用工具：
Action: image_gen
Action Input: {"text": "小龙女在古墓派后山修炼内功", "resolution": "1280*720"}
Observation: <result>![IMAGEGEN](https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/1d/f1/20231207/8d820c8d/463b323b-6209-4095-b1c3-f7c4dd337e6c-1.png?Expires=1702002840&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=zg6mIsIU3XDNrQxhwNWSt9QWTDI%3D)</result>
![小龙女在古墓派后山修炼内功](https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/1d/f1/20231207/8d820c8d/463b323b-6209-4095-b1c3-f7c4dd337e6c-1.png?Expires=1702002840&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=zg6mIsIU3XDNrQxhwNWSt9QWTDI%3D)


<选择>：
A: 继续修炼，不理睬那声音。
B: 走向声音的来源，查看发生了什么。
C: 召唤你的蜜蜂去调查情况。
D: 输入玩家的选择。

 */
const find_json_pattern = /{[\s\S]+}/;

// Convert the output of qwen
export const qwen = (
  text: string,
  options?: {
    action_input_title?: string;
    action_output_title?: string;
    auto_end?: boolean;
  }
) => {
  let loop_pos = 0;
  let result = '';

  const ACTION = 'Action:';
  const ACTION_INPUT = 'Action Input:';
  const OBSERVATION = 'Observation:';
  const RESULT_START = '<result>';
  const RESULT_END = '</result>';

  const findChainOfThinking = (thinking_text: string, start_pos: number) => {
    let pos = start_pos;
    let actionName = '';
    let actionBody = '';
    let resultBody = '';
    let finished = false;
    const flag_action = findNextPattern(thinking_text, ACTION, pos);
    if (!flag_action.found) {
      return {
        found: false,
        pos,
      };
    }
    const actionNameRet = consumePattern(
      thinking_text,
      ACTION,
      ACTION_INPUT,
      pos
    );
    if (actionNameRet) {
      actionName = trimString(actionNameRet.content);
      pos = actionNameRet.pos;
      if (actionNameRet.finish) {
        const actionBodyRet = consumePattern(
          thinking_text,
          ACTION_INPUT,
          OBSERVATION,
          pos
        );
        if (actionBodyRet) {
          actionBody = trimString(actionBodyRet.content);
          pos = actionBodyRet.pos;
          if (actionBodyRet.finish) {
            const observationFlag = findNextPattern(
              thinking_text,
              OBSERVATION,
              pos
            );
            if (observationFlag) {
              const resultBodyRet = consumePattern(
                thinking_text,
                RESULT_START,
                RESULT_END,
                pos
              );
              if (resultBodyRet) {
                resultBody = resultBodyRet.content;
                pos = resultBodyRet.pos + RESULT_END.length;
                finished = true;
              }
            }
          }
        }
      }
    }
    return {
      beforeContent: thinking_text.substring(start_pos, flag_action.pos),
      found: true,
      finished,
      pos,
      actionName,
      actionBody,
      resultBody,
    };
  };

  do {
    const {
      found,
      finished,
      beforeContent,
      actionName,
      actionBody,
      resultBody,
      pos,
    } = findChainOfThinking(text, loop_pos);

    loop_pos = pos;
    if (beforeContent) {
      result += beforeContent;
    }
    if (found) {
      if (actionName) {
        let actionBodyContent = '';
        if (actionBody) {
          const is_json = find_json_pattern.exec(actionBody);
          if (is_json) {
            actionBodyContent = `\`\`\`json\n${actionBody}\n\n\`\`\``;
          } else {
            actionBodyContent = actionBody;
          }
        }
        result += [
          '\n:::llm-thinking',
          `::llm-thinking-title[${options?.action_input_title?.replaceAll(
            '<Action>',
            actionName
          )}]`,
          actionBodyContent,
          ':::\n',
        ].join('\n');
      }
      if (resultBody) {
        result += [
          '\n:::llm-thinking',
          `::llm-thinking-title[${options?.action_output_title}]`,
          resultBody,
          ':::\n',
          options?.auto_end && finished ? ':flushing-end' : '',
        ].join('\n');
      }
    }
    if (!found || (found && !finished)) {
      break;
    }
  } while (true); // eslint-disable-line
  result += text.substring(loop_pos);
  return result;
};
