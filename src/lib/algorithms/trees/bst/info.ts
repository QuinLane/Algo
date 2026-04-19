import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `A Binary Search Tree (BST) is a node-based data structure where each node has at most two children. For every node, all values in the left subtree are smaller and all values in the right subtree are larger. This ordering property makes search, insert, and delete operations efficient by allowing the algorithm to eliminate half the remaining tree at each comparison.

BSTs are the foundation for many advanced data structures, including AVL trees, red-black trees, and B-trees. Their performance depends heavily on balance — a well-balanced BST offers O(log n) operations, while a degenerate (sorted-input) BST degrades to O(n).`,

    howItWorks: [
      "Start at the root node.",
      "Compare the target value with the current node's value.",
      "If equal, the value is found (or this is the insertion point for a duplicate check).",
      "If the target is less, move to the left child; if greater, move to the right child.",
      "Repeat until the target is found or a null child is reached.",
      "For insertion: create a new node at the null position where the search terminated.",
      "For search: return found/not-found based on whether the loop ended at the target or null.",
    ],

    useCases: [
      "Dynamic sorted sets — maintaining sorted order while supporting fast insertions and deletions.",
      "Symbol tables — compilers and interpreters use BST-based maps for variable lookup.",
      "Range queries — finding all values between a lower and upper bound in O(log n + k).",
      "Database indexing — underlying structure for many database index implementations.",
    ],

    complexity: {
      time: {
        best: { value: "O(log n)", note: "Balanced tree — each comparison halves the search space." },
        average: { value: "O(log n)", note: "Random insertion order produces a roughly balanced tree." },
        worst: { value: "O(n)", note: "Sorted input produces a degenerate linked list." },
      },
      space: { value: "O(n)", note: "One node per inserted value." },
    },
  },

  code: {
    javascript: `class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() { this.root = null; }

  insert(value) {
    const node = new BSTNode(value);
    if (!this.root) { this.root = node; return; }
    let cur = this.root;
    while (true) {
      if (value < cur.value) {
        if (!cur.left) { cur.left = node; return; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; return; }
        cur = cur.right;
      }
    }
  }

  search(value) {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return cur;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return null;
  }
}`,

    python: `class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        node = BSTNode(value)
        if not self.root:
            self.root = node
            return
        cur = self.root
        while True:
            if value < cur.value:
                if cur.left is None:
                    cur.left = node
                    return
                cur = cur.left
            else:
                if cur.right is None:
                    cur.right = node
                    return
                cur = cur.right

    def search(self, value):
        cur = self.root
        while cur:
            if value == cur.value:
                return cur
            cur = cur.left if value < cur.value else cur.right
        return None`,

    java: `class BST {
    static class Node {
        int value; Node left, right;
        Node(int v) { value = v; }
    }
    Node root;

    void insert(int value) {
        Node node = new Node(value);
        if (root == null) { root = node; return; }
        Node cur = root;
        while (true) {
            if (value < cur.value) {
                if (cur.left == null) { cur.left = node; return; }
                cur = cur.left;
            } else {
                if (cur.right == null) { cur.right = node; return; }
                cur = cur.right;
            }
        }
    }

    Node search(int value) {
        Node cur = root;
        while (cur != null) {
            if (value == cur.value) return cur;
            cur = value < cur.value ? cur.left : cur.right;
        }
        return null;
    }
}`,

    cpp: `struct BSTNode {
    int value;
    BSTNode *left, *right;
    BSTNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

class BST {
public:
    BSTNode* root = nullptr;

    void insert(int value) {
        BSTNode* node = new BSTNode(value);
        if (!root) { root = node; return; }
        BSTNode* cur = root;
        while (true) {
            if (value < cur->value) {
                if (!cur->left) { cur->left = node; return; }
                cur = cur->left;
            } else {
                if (!cur->right) { cur->right = node; return; }
                cur = cur->right;
            }
        }
    }

    BSTNode* search(int value) {
        BSTNode* cur = root;
        while (cur) {
            if (value == cur->value) return cur;
            cur = value < cur->value ? cur->left : cur->right;
        }
        return nullptr;
    }
};`,
  },
};
