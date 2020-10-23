import { commands, CompleteResult, ExtensionContext, listManager, sources, workspace } from 'coc.nvim';
import DemoList from './lists';

export async function activate(context: ExtensionContext): Promise<void> {
  const { nvim } = workspace;

  context.subscriptions.push(
    commands.registerCommand('plugin.browse', async () => {
      const res = await nvim.eval(String.raw`matchstr(getline('.'), '[''"]\zs[^''"]\+\ze[''"]')`);
      if (res) {
        const pluginUri = res as string;
        const url = `https://github.com/${pluginUri}`;
        workspace.showMessage(url);
        await nvim.command(String.raw`:!open ${url}`);
      } else {
        workspace.showMessage('no plugin literal near cursor', 'warning');
      }
    }),

    listManager.registerList(new DemoList(workspace.nvim)),

    sources.createSource({
      name: 'plugin-browse', // unique id
      shortcut: '[CS]', // [CS] is custom source
      priority: 1,
      triggerPatterns: [], // RegExp pattern
      doComplete: async () => {
        const items = await getCompletionItems();
        return items;
      },
    }),

    workspace.registerKeymap(
      ['n'],
      'plugin-browse-keymap',
      async () => {
        workspace.showMessage(`registerKeymap`);
      },
      { sync: false }
    ),

    workspace.registerAutocmd({
      event: 'InsertLeave',
      request: true,
      callback: () => {
        workspace.showMessage(`registerAutocmd on InsertLeave`);
      },
    })
  );
}

async function getCompletionItems(): Promise<CompleteResult> {
  return {
    items: [
      {
        word: 'TestCompletionItem 1',
      },
      {
        word: 'TestCompletionItem 2',
      },
    ],
  };
}
