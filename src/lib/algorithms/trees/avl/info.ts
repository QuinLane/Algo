import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `An AVL tree is a self-balancing Binary Search Tree named after its inventors Adelson-Velsky and Landis. After each insertion or deletion, the tree checks the balance factor (left height minus right height) at each ancestor node. If any node has a balance factor of +2 or -2, a rotation is performed to restore balance.

AVL trees guarantee O(log n) height at all times, making worst-case performance equivalent to average-case. The tradeoff is slightly more expensive insertions due to rotations, but lookups are always fast. There are four rotation types: LL, RR, LR, and RL — each addressing a specific imbalance pattern.`,

    howItWorks: [
      "Insert the new node using standard BST insertion, walking down the tree comparing values.",
      "After insertion, walk back up from the new node to the root, updating height at each node.",
      "At each ancestor, compute the balance factor: height(left) − height(right).",
      "If balance factor is +2 (left-heavy), check the left child's balance factor.",
      "Left child bf ≥ 0 → LL single right rotation. Left child bf < 0 → LR double rotation (left-rotate child, then right-rotate node).",
      "If balance factor is -2 (right-heavy), check the right child's balance factor.",
      "Right child bf ≤ 0 → RR single left rotation. Right child bf > 0 → RL double rotation (right-rotate child, then left-rotate node).",
    ],

    useCases: [
      "Database indexes — B-trees and AVL trees underpin balanced lookup structures in databases.",
      "In-memory sorted maps — where worst-case lookup time must be bounded (e.g., order-book engines).",
      "Text editors — rope data structures use AVL-like balancing for efficient string operations.",
      "Any BST use case where sorted input would otherwise degrade performance to O(n).",
    ],

    complexity: {
      time: {
        best: { value: "O(log n)", note: "Tree is already balanced; single comparison path." },
        average: { value: "O(log n)", note: "Height is always bounded by 1.44 log₂(n+2)." },
        worst: { value: "O(log n)", note: "Unlike a plain BST, worst case is always O(log n)." },
      },
      space: { value: "O(n)", note: "One node per value plus O(log n) stack space for rotations." },
    },
  },

  code: {
    javascript: `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = this.right = null;
    this.height = 1;
  }
}

function height(n) { return n ? n.height : 0; }
function bf(n) { return n ? height(n.left) - height(n.right) : 0; }
function update(n) { n.height = 1 + Math.max(height(n.left), height(n.right)); }

function rotateRight(y) {
  const x = y.left, t = x.right;
  x.right = y; y.left = t;
  update(y); update(x);
  return x;
}

function rotateLeft(x) {
  const y = x.right, t = y.left;
  y.left = x; x.right = t;
  update(x); update(y);
  return y;
}

function rebalance(n) {
  update(n);
  if (bf(n) > 1) {
    if (bf(n.left) < 0) n.left = rotateLeft(n.left);
    return rotateRight(n);
  }
  if (bf(n) < -1) {
    if (bf(n.right) > 0) n.right = rotateRight(n.right);
    return rotateLeft(n);
  }
  return n;
}

function insert(node, value) {
  if (!node) return new AVLNode(value);
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);
  return rebalance(node);
}`,

    python: `class AVLNode:
    def __init__(self, value):
        self.value = value
        self.left = self.right = None
        self.height = 1

def height(n): return n.height if n else 0
def bf(n): return height(n.left) - height(n.right) if n else 0
def update(n): n.height = 1 + max(height(n.left), height(n.right))

def rotate_right(y):
    x, t = y.left, y.left.right
    x.right, y.left = y, t
    update(y); update(x)
    return x

def rotate_left(x):
    y, t = x.right, x.right.left
    y.left, x.right = x, t
    update(x); update(y)
    return y

def rebalance(n):
    update(n)
    if bf(n) > 1:
        if bf(n.left) < 0: n.left = rotate_left(n.left)
        return rotate_right(n)
    if bf(n) < -1:
        if bf(n.right) > 0: n.right = rotate_right(n.right)
        return rotate_left(n)
    return n

def insert(node, value):
    if not node: return AVLNode(value)
    if value < node.value: node.left = insert(node.left, value)
    else: node.right = insert(node.right, value)
    return rebalance(node)`,

    java: `class AVL {
    static class Node {
        int value, height = 1;
        Node left, right;
        Node(int v) { value = v; }
    }
    Node root;

    int h(Node n) { return n == null ? 0 : n.height; }
    int bf(Node n) { return n == null ? 0 : h(n.left) - h(n.right); }
    void update(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }

    Node rotateRight(Node y) {
        Node x = y.left, t = x.right;
        x.right = y; y.left = t;
        update(y); update(x); return x;
    }

    Node rotateLeft(Node x) {
        Node y = x.right, t = y.left;
        y.left = x; x.right = t;
        update(x); update(y); return y;
    }

    Node rebalance(Node n) {
        update(n);
        if (bf(n) > 1) {
            if (bf(n.left) < 0) n.left = rotateLeft(n.left);
            return rotateRight(n);
        }
        if (bf(n) < -1) {
            if (bf(n.right) > 0) n.right = rotateRight(n.right);
            return rotateLeft(n);
        }
        return n;
    }

    Node insert(Node n, int value) {
        if (n == null) return new Node(value);
        if (value < n.value) n.left = insert(n.left, value);
        else n.right = insert(n.right, value);
        return rebalance(n);
    }
}`,

    cpp: `struct AVLNode {
    int value, height = 1;
    AVLNode *left = nullptr, *right = nullptr;
    AVLNode(int v) : value(v) {}
};

int h(AVLNode* n) { return n ? n->height : 0; }
int bf(AVLNode* n) { return n ? h(n->left) - h(n->right) : 0; }
void update(AVLNode* n) { n->height = 1 + max(h(n->left), h(n->right)); }

AVLNode* rotateRight(AVLNode* y) {
    auto x = y->left; auto t = x->right;
    x->right = y; y->left = t;
    update(y); update(x); return x;
}

AVLNode* rotateLeft(AVLNode* x) {
    auto y = x->right; auto t = y->left;
    y->left = x; x->right = t;
    update(x); update(y); return y;
}

AVLNode* rebalance(AVLNode* n) {
    update(n);
    if (bf(n) > 1) {
        if (bf(n->left) < 0) n->left = rotateLeft(n->left);
        return rotateRight(n);
    }
    if (bf(n) < -1) {
        if (bf(n->right) > 0) n->right = rotateRight(n->right);
        return rotateLeft(n);
    }
    return n;
}

AVLNode* insert(AVLNode* n, int value) {
    if (!n) return new AVLNode(value);
    if (value < n->value) n->left = insert(n->left, value);
    else n->right = insert(n->right, value);
    return rebalance(n);
}`,
  },
};
