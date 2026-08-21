package com.dalhousie.app.workers

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import androidx.work.workDataOf

class SyncWorker(
    appContext: Context,
    params: WorkerParameters
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        // TODO: pull/push lightweight sync data here when you add offline queues.
        return Result.success(workDataOf("synced" to true))
    }
}
