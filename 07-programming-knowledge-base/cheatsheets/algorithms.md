# Algorithms & Data Structures Cheatsheet

## Fast Sliding Window Template (Python)
```python
def max_subarray_len(nums: list[int], k: int) -> int:
    left = 0
    curr_sum = 0
    max_len = 0
    for right in range(len(nums)):
        curr_sum += nums[right]
        while curr_sum > k and left <= right:
            curr_sum -= nums[left]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len
```

## Breadth-First Search (Graph / Grid)
```python
from collections import deque

def bfs(start_node, graph):
    visited = {start_node}
    queue = deque([start_node])
    while queue:
        curr = queue.popleft()
        for neighbor in graph[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```
