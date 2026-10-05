import connectDB from "../connection";
import { Navigation, INavigationTreeDoc, INavTreeTabModel } from "../../models/Navigation";
import { DEFAULT_NAVIGATION_TREE, NavigationTree } from "../../tree-store";

export class NavigationRepository {
  async getTree(treeKey = "default"): Promise<NavigationTree | null> {
    await connectDB();
    const doc = await Navigation.findOne({ treeKey }).lean().exec() as unknown as INavigationTreeDoc | null;
    if (!doc || !doc.tabs || doc.tabs.length === 0) {
      return null;
    }
    return { tabs: doc.tabs as unknown as NavigationTree["tabs"] };
  }

  async saveTree(tree: NavigationTree, treeKey = "default"): Promise<NavigationTree> {
    await connectDB();
    const updated = await Navigation.findOneAndUpdate(
      { treeKey },
      { treeKey, tabs: tree.tabs as unknown as INavTreeTabModel[] },
      { upsert: true, returnDocument: "after" }
    ).lean().exec() as unknown as INavigationTreeDoc;

    return { tabs: updated.tabs as unknown as NavigationTree["tabs"] };
  }

  async resetTree(treeKey = "default"): Promise<NavigationTree> {
    return this.saveTree(DEFAULT_NAVIGATION_TREE, treeKey);
  }
}

export const navigationRepository = new NavigationRepository();
