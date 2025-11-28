# Troubleshooting Guide

## Error Types and Codes
- validation_error: Client input invalid (categories, tasks, accounts)
- duplicate_category: Category name already exists for user
- auth_required: User not authenticated
- db_error: Firestore operation failed (see `code` for provider-specific code)

## Common Issues
- Firestore index errors when querying multiple fields:
  - Ensure a composite index on `categories(userId, normalizedName)` if you receive index errors.
  - Consider adding `orderBy('createdAt')` with appropriate indexes for server-side sorting.
- Permission denied:
  - Check Firestore security rules for access to `categories`, `tasks`, and `logs` collections.
- Network timeouts or offline:
  - Handle `subscribeTo...` callbacks gracefully; UI shows empty state when offline.

## Logging
- Errors are written to console and to `logs` collection with context and timestamps.
- Use Firebase console to inspect `logs` for patterns.

## Validation
- Category names: required, ≤64 chars, unique per user (case-insensitive).
- Task text: required, ≤500 chars.
- Accounts: email format, password ≥6 chars, display name required.

## Performance
- Category delete uses batch writes to delete tasks and category atomically.
- Subscribe endpoints sort client-side to avoid composite index; for large datasets, prefer server-side ordering with indexes.

