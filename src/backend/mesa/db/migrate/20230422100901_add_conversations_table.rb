# frozen_string_literal: true

class AddConversationsTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TABLE "conversations" (
        "id" BIGSERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP(6) NOT NULL,
        "updated_at" TIMESTAMP(6) NOT NULL
      );
    SQL
  end

  def down
    execute <<-SQL
      DROP TABLE "conversations";
    SQL
  end
end
