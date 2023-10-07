# frozen_string_literal: true

class AddUserIdToConversationsTable < ActiveRecord::Migration[7.0]

  def up
    execute <<-SQL
      ALTER TABLE "conversations"
      ADD COLUMN "user_id" INTEGER;
    SQL

    execute <<-SQL
      CREATE INDEX "index_conversations_on_user_id" ON "conversations" ("user_id");
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX "index_conversations_on_user_id";
    SQL

    execute <<-SQL
      ALTER TABLE "conversations"
      DROP COLUMN "user_id";
    SQL
  end
end
