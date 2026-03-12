<?php

namespace App\Filament\Admin\Resources\Languages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class LanguagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sym')
                    ->label('Symbol')
                    ->badge()
                    ->color('warning')
                    ->fontFamily('mono')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('cat')
                    ->label('Category')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'systems'    => 'danger',
                        'scripting'  => 'warning',
                        'oop'        => 'info',
                        'functional' => 'success',
                        'web'        => 'primary',
                        'scientific' => 'gray',
                        'esoteric'   => 'danger',
                        'logic'      => 'info',
                        'general'    => 'warning',
                        'hardware'   => 'gray',
                        default      => 'gray',
                    })
                    ->searchable()
                    ->sortable(),

                TextColumn::make('year')
                    ->sortable(),

                TextColumn::make('paradigm')
                    ->searchable()
                    ->limit(40)
                    ->tooltip(fn (string $state): string => $state),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name')
            ->defaultPaginationPageOption(25)
            ->filters([
                SelectFilter::make('cat')
                    ->label('Category')
                    ->options([
                        'systems'    => 'Systems',
                        'scripting'  => 'Scripting',
                        'oop'        => 'OOP',
                        'functional' => 'Functional',
                        'web'        => 'Web',
                        'scientific' => 'Scientific',
                        'esoteric'   => 'Esoteric',
                        'logic'      => 'Logic',
                        'general'    => 'General',
                        'hardware'   => 'Hardware',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
