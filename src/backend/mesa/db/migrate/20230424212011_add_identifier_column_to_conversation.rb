# frozen_string_literal: true

class AddIdentifierColumnToConversation < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "conversations"
      ADD COLUMN "identifier" VARCHAR(255) NULL;
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "conversations"
      DROP COLUMN "identifier";
    SQL
  end
end
