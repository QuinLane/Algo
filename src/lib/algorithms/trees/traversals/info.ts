import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Tree traversal algorithms visit every node in a binary tree exactly once. The three classical orderings — in-order, pre-order, and post-order — differ only in when the current node is processed relative to its left and right subtrees.

In-order traversal of a BST always produces the values in sorted ascending order, making it the most commonly used. Pre-order traversal visits the root first, which is useful for copying or serializing a tree. Post-order traversal visits the root last, which is natural for deletion or expression evaluation.`,

    howItWorks: [
      "All three traversals use the same recursive structure on the left subtree, current node, and right subtree.",
      "In-order: recurse left → visit node → recurse right. Produces sorted output on a BST.",
      "Pre-order: visit node → recurse left → recurse right. Root is always output first.",
      "Post-order: recurse left → recurse right → visit node. Root is always output last.",
      "Each traversal visits every node exactly once, so time complexity is always O(n).",
      "Recursion uses O(h) stack space, where h is the tree height (O(log n) balanced, O(n) worst).",
    ],

    useCases: [
      "In-order — printing BST values in sorted order; sorted iterators over tree-backed maps.",
      "Pre-order — serializing/copying a tree structure; expression tree prefix notation.",
      "Post-order — deleting all nodes safely; expression tree postfix (reverse Polish) notation.",
      "All three — used in compiler AST processing, file system traversal, and XML/HTML parsing.",
    ],

    complexity: {
      time: {
        best: { value: "O(n)", note: "Every node must be visited exactly once regardless of tree shape." },
        average: { value: "O(n)", note: "All traversals are O(n) in all cases." },
        worst: { value: "O(n)", note: "Degenerate trees still require visiting every node." },
      },
      space: {
        value: "O(h)",
        note: "Implicit recursion stack depth equals tree height: O(log n) balanced, O(n) worst.",
      },
    },
  },

  code: {
    javascript: `// In-order: left → node → right
function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}

// Pre-order: node → left → right
function preorder(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

// Post-order: left → right → node
function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.value);
  return result;
}`,

    python: `def inorder(node, result=None):
    if result is None: result = []
    if not node: return result
    inorder(node.left, result)
    result.append(node.value)
    inorder(node.right, result)
    return result

def preorder(node, result=None):
    if result is None: result = []
    if not node: return result
    result.append(node.value)
    preorder(node.left, result)
    preorder(node.right, result)
    return result

def postorder(node, result=None):
    if result is None: result = []
    if not node: return result
    postorder(node.left, result)
    postorder(node.right, result)
    result.append(node.value)
    return result`,

    java: `List<Integer> inorder(Node node) {
    List<Integer> result = new ArrayList<>();
    inorderHelper(node, result);
    return result;
}
void inorderHelper(Node n, List<Integer> r) {
    if (n == null) return;
    inorderHelper(n.left, r);
    r.add(n.value);
    inorderHelper(n.right, r);
}

List<Integer> preorder(Node node) {
    List<Integer> result = new ArrayList<>();
    preorderHelper(node, result);
    return result;
}
void preorderHelper(Node n, List<Integer> r) {
    if (n == null) return;
    r.add(n.value);
    preorderHelper(n.left, r);
    preorderHelper(n.right, r);
}

List<Integer> postorder(Node node) {
    List<Integer> result = new ArrayList<>();
    postorderHelper(node, result);
    return result;
}
void postorderHelper(Node n, List<Integer> r) {
    if (n == null) return;
    postorderHelper(n.left, r);
    postorderHelper(n.right, r);
    r.add(n.value);
}`,

    cpp: `void inorder(TreeNode* n, vector<int>& res) {
    if (!n) return;
    inorder(n->left, res);
    res.push_back(n->value);
    inorder(n->right, res);
}

void preorder(TreeNode* n, vector<int>& res) {
    if (!n) return;
    res.push_back(n->value);
    preorder(n->left, res);
    preorder(n->right, res);
}

void postorder(TreeNode* n, vector<int>& res) {
    if (!n) return;
    postorder(n->left, res);
    postorder(n->right, res);
    res.push_back(n->value);
}`,
  },
};
